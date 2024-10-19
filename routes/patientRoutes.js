const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth'); // Make sure this import is correct

// Register a new patient
router.post('/register', (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Patient registered successfully' });
    }
  );
});

// Patient login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM patients WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const patient = results[0];
    const passwordMatch = bcrypt.compareSync(password, patient.password_hash);

    if (!passwordMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ patientId: patient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token });
  });
});

// Get patient profile
router.get('/profile', authenticateToken, (req, res) => {
  const { patientId } = req.user;

  db.query('SELECT first_name, last_name, email, phone, date_of_birth, gender, address FROM patients WHERE id = ?', [patientId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(results[0]);
  });
});

// Update patient profile
router.put('/profile', authenticateToken, (req, res) => {
  const { patientId } = req.user;
  const { first_name, last_name, phone, address } = req.body;

  db.query(
    'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
    [first_name, last_name, phone, address, patientId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;
