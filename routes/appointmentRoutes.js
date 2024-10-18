const express = require('express');
const db = require('../database');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Book an appointment
router.post('/', authenticateToken, (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;
  const { patientId } = req.user;

  db.query(
    'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
    [patientId, doctor_id, appointment_date, appointment_time, 'Scheduled'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Appointment booked successfully' });
    }
  );
});

// Get patient appointments
router.get('/', authenticateToken, (req, res) => {
  const { patientId } = req.user;

  db.query('SELECT * FROM appointments WHERE patient_id = ?', [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Cancel an appointment
router.put('/:id/cancel', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query('UPDATE appointments SET status = ? WHERE id = ?', ['Canceled', id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Appointment canceled successfully' });
  });
});

module.exports = router;
