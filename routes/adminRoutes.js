// adminRoutes.js

const express = require('express');
const router = express.Router();
const { authAdmin } = require('../middleware/auth'); // Assuming you have an admin authentication middleware
const db = require('../database');

// Admin route to add a new doctor
router.post('/add-doctor', authAdmin, (req, res) => {
  const { firstName, lastName, specialization, availability } = req.body;
  
  const query = 'INSERT INTO doctors (first_name, last_name, specialization, availability) VALUES (?, ?, ?, ?)';
  db.query(query, [firstName, lastName, specialization, availability], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding doctor', error: err });
    }
    res.status(201).json({ message: 'Doctor added successfully!' });
  });
});

// Admin route to view all patients
router.get('/patients', authAdmin, (req, res) => {
  const query = 'SELECT * FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving patients', error: err });
    }
    res.status(200).json(results);
  });
});

// Admin route to delete a doctor by ID
router.delete('/delete-doctor/:id', authAdmin, (req, res) => {
  const doctorId = req.params.id;
  
  const query = 'DELETE FROM doctors WHERE id = ?';
  db.query(query, [doctorId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting doctor', error: err });
    }
    res.status(200).json({ message: 'Doctor deleted successfully!' });
  });
});

module.exports = router;
