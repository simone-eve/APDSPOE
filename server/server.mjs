// Import required packages
import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import ExpressBrute from 'express-brute'; 
import helmet from 'helmet';

const app = express();
const port = 3002; // Set your preferred port

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// MongoDB setup
const url = 'mongodb://localhost:27017'; // Base MongoDB connection string without database
const client = new MongoClient(url, { useUnifiedTopology: true });

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

// Set up brute-force protection using in-memory storage (not recommended for production)
const store = new ExpressBrute.MemoryStore(); 
const bruteForce = new ExpressBrute(store, {
  freeRetries: 5, // Allow up to 5 attempts
  minWait: 60 * 60 * 1000,  // 5 seconds wait after failed attempts
  maxWait: 60 * 60 * 1000, // Maximum 1-minute wait
  lifetime: 60 * 60, // 1 hour before the retry count resets
});

// POST endpoint to handle user registration
app.post('/api/register', bruteForce.prevent, async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  // Validate user input
  if (!fullName || !idNumber || !accountNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const database = client.db('APD'); // Database name
  const collection = database.collection('users'); // Collection name for users

  try {
    // Check for existing user by ID number
    const existingUser = await collection.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID number already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword, // Store the hashed password
    };

    // Insert the new user into the collection
    const result = await collection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
});

// POST endpoint to handle payment form submission
app.post('/api/payments', async (req, res) => {
  try {
    const database = client.db('APD'); // Database name
    const collection = database.collection('PaymentForm'); // Collection name for payments

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

// POST endpoint to handle user login
app.post('/api/login', bruteForce.prevent, async (req, res) => {
  const { fullName, accountNumber, password } = req.body;

  // Validate input
  if (!fullName || !accountNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const database = client.db('APD'); // Your database name
  const collection = database.collection('users');

  try {
    // Find user by account number
    const user = await collection.findOne({ accountNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login, return user info
    res.status(200).json({ message: 'Login successful', userId: user._id }); // Send user ID or any relevant info
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
