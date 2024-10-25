const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connection = require('./database');
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Routes
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Catch-All Route
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
