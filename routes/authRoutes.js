const express = require('express');
const router = express.Router();

// Sample in-memory storage (use a real database in production)
const users = [];

router.post('/register', (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    // Simple validation
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
    }

    // Create and save the new user
    const newUser = { id: users.length + 1, first_name, last_name, email, password, phone, date_of_birth, gender, address };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully', id: newUser.id });
});

module.exports = router;
