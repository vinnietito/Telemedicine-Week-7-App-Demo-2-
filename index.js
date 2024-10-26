const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Update this to your frontend URL if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Enable credentials for cookie support
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend'))); // Serve static files from the frontend directory

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Serve login.html at the /login URL
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// API route for registering a patient
app.post('/api/patients/register', (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, dob, gender } = req.body;

    // Simulate a database save operation
    console.log(`Registering patient with Email: ${email}`);

    // Prepare a JSON response
    const response = { message: 'Patient registered successfully!' };
    console.log('Response:', JSON.stringify(response)); // Log the response

    // Send a success response (you can implement actual database logic here)
    res.status(201).json(response);
});

// API route for logging in a patient
app.post('/api/patients/login', (req, res) => {
    const { email, password } = req.body;

    // Simulate a login operation (replace with actual authentication logic)
    console.log(`Logging in patient with Email: ${email}`);
    
    // For demonstration, let's assume the login is always successful
    const response = { message: 'Login successful!' };
    console.log('Response:', JSON.stringify(response)); // Log the response

    // Send a success response
    res.status(200).json(response);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ error: 'Something went wrong!' }); // Return a JSON response
});

// Catch-All Route
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
