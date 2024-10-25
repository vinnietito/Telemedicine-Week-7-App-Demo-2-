// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Register a new user (patient)
exports.registerUser = (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

  // Input validation
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the email already exists
  db.query('SELECT * FROM patients WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error during email check:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    // Insert new patient into the database
    db.query(
      'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address],
      (err, result) => {
        if (err) {
          console.error('Database error during patient registration:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Patient registered successfully' });
      }
    );
  });
};

// User login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  db.query('SELECT * FROM patients WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const patient = results[0];
    const passwordMatch = bcrypt.compareSync(password, patient.password_hash);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ patientId: patient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token });
  });
};
