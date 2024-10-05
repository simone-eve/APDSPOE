
// import express from 'express';
// import { MongoClient } from 'mongodb';
// import bodyParser from 'body-parser';
// import cors from 'cors';

// const app = express();
// const port = 3000; // Set your preferred port

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB setup
// const url = 'mongodb://localhost:27017/APD'; // Your MongoDB connection string
// const client = new MongoClient(url);

// async function connectToDb() {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB successfully!');
//     } catch (error) {
//         console.error('MongoDB connection failed:', error);
//         process.exit(1);
//     }
// }

// connectToDb();

// // POST endpoint to handle form submission
// app.post('/api/payments', async (req, res) => {
//     try {
//         const database = client.db('APD'); // Database name
//         const collection = database.collection('PaymentForm'); // Collection name
//         // Extract payment data from the request body
//         const paymentData = {
//             ...req.body,
//             userId: req.body.userId || null, // Accept userId, or set to null
//         };

//         // Insert the payment data into the collection
//         const result = await collection.insertOne(paymentData);

//         res.status(201).json({ message: 'Payment recorded successfully', insertedId: result.insertedId });
//     } catch (error) {
//         console.error('Error recording payment:', error);
//         res.status(500).json({ message: 'Failed to record payment', error });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);



// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, phone, password } = req.body;

    // Input Whitelisting
    const usernamePattern = /^[a-zA-Z0-9]{5,15}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^[a-zA-Z0-9!@#$%^&*()_+-=]{8,20}$/;

    if (!usernamePattern.test(username)) {
        return res.status(400).json({ message: 'Invalid username format' });
    }
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!phonePattern.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }
    if (!passwordPattern.test(password)) {
        return res.status(400).json({ message: 'Invalid password format' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const newUser = new User({ username, email, phone, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
