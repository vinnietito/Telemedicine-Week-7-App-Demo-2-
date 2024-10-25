// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../database'); // Ensure this path is correct
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    try {
        // Check if the email is already registered
        connection.query('SELECT * FROM patients WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (results.length > 0) {
                return res.json({ success: false, message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the patient into the database
            const query = `
                INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            connection.query(query, [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                res.json({ success: true, message: 'Patient registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM patients WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        const patient = results[0];

        // Compare password
        const match = await bcrypt.compare(password, patient.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        res.json({ success: true, message: 'Login successful', user: patient });
    });
});

module.exports = router;
