const express = require('express');
const db = require('../database');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// List doctors
router.get('/', (req, res) => {
  db.query('SELECT * FROM doctors', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add new doctor
router.post('/', authenticateToken, (req, res) => {
  const { first_name, last_name, specialization, availability_time, availability_date } = req.body;

  db.query(
    'INSERT INTO doctors (first_name, last_name, specialization, availability_time, availability_date) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, specialization, availability_time, availability_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Doctor added successfully' });
    }
  );
});

module.exports = router;
