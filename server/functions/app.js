require('dotenv').config(); // Import dotenv

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');
const authRouter = require('./controller'); // Importing the router from controller.js

const app = express();
const port = process.env.PORT || 3001;
const mongodbUri = process.env.MONGODB_URI; // Use environment variable for MongoDB URI

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mounting the router from controller.js at '/auth' endpoint
app.use('/auth', authRouter);

// MongoDB connection setup
mongoose.connect(mongodbUri).then(() => {
    console.log('MongoDB connection is established successfully! 🎉');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Mounting the router from controller.js at '/.netlify/functions/app' endpoint
app.use("/.netlify/functions/app", authRouter);

// Exporting the app wrapped with serverless-http for Netlify compatibility
module.exports.handler = serverless(app);