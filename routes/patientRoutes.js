const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Register a new patient
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
  console.log('Registration request body:', req.body);

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'All required fields (first_name, last_name, email, password) must be filled' });
  }

  try {
    const [results] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
    if (results.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address]
    );
    console.log('Patient registered successfully:', { email });
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    console.error('Database error during patient registration:', err);
    return res.status(500).json({ error: 'Server error during registration', details: err.message });
  }
});

// Patient login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
    if (results.length === 0) {
      console.log('Invalid credentials for email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const patient = results[0];
    const passwordMatch = await bcrypt.compare(password, patient.password_hash);
    if (!passwordMatch) {
      console.log('Invalid credentials for email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ patientId: patient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
       .json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Database error during login:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all patients (Enhanced error logging)
router.get('/', async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patients');
    res.json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err.message); // Logging the specific error message
    res.status(500).json({ error: 'Error fetching patients', details: err.message }); // Send the error details back to the client
  }
});

// Get patient profile
router.get('/profile', authenticateToken, async (req, res) => {
  const { patientId } = req.user;
  try {
    const [results] = await db.query(
      'SELECT first_name, last_name, email, phone, date_of_birth, gender, address FROM patients WHERE id = ?',
      [patientId]
    );
    if (results.length === 0) {
      console.error('Patient not found');
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching patient profile:', err);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update patient profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { patientId } = req.user;
  const { first_name, last_name, phone, address } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    await db.query(
      'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
      [first_name, last_name, phone, address, patientId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating patient profile:', err);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

module.exports = router;
