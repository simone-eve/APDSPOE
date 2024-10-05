import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000; // Set your preferred port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB setup
const url = 'mongodb://localhost:27017/APD'; // Your MongoDB connection string
const client = new MongoClient(url);

async function connectToDb() {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}

connectToDb();

// POST endpoint to handle form submission
app.post('/api/payments', async (req, res) => {
    try {
        const database = client.db('APD'); // Database name
        const collection = database.collection('PaymentForm'); // Collection name
        // Extract payment data from the request body
        const paymentData = {
            ...req.body,
            userId: req.body.userId || null, // Accept userId, or set to null
        };

        // Insert the payment data into the collection
        const result = await collection.insertOne(paymentData);

        res.status(201).json({ message: 'Payment recorded successfully', insertedId: result.insertedId });
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ message: 'Failed to record payment', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
