// Import required packages
import https from 'https';
import fs from 'fs';
import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import ExpressBrute from 'express-brute';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

const app = express();
const port = 3000; // Set your preferred port

const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined')); 
app.use(express.json());

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

const store = new ExpressBrute.MemoryStore(); 
const bruteForce = new ExpressBrute(store, {
  freeRetries: 5, // Allow up to 5 attempts
  minWait: 60 * 60 * 1000,  // 5 seconds wait after failed attempts
  maxWait: 60 * 60 * 1000, // Maximum 1-minute wait
  lifetime: 60 * 60, // 1 hour before the retry count resets
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to specific routes
app.use('/api/register', apiLimiter); // Apply to registration
app.use('/api/login', apiLimiter); // Apply to login
app.use('/api/payments', apiLimiter); // Apply to payment submission

// POST endpoint to handle user registration
app.post('/api/register', bruteForce.prevent,  [
  // Add validation rules using express-validator
  body('userId').notEmpty().withMessage('User ID is required'),
  body('fullName').isString().withMessage('Full name must be a string'),
  body('idNumber').isLength({ min: 13, max: 13 }).withMessage('ID number must be 13 characters long'),
  body('accountNumber').isNumeric().withMessage('Account number must be numeric'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract error messages and join them as a single string
    const errorMessages = errors.array().map(error => error.msg).join(', ');

    // Create an object with specific field errors
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    // Respond with a detailed error message and field-specific errors
    return res.status(400).json({ message: `Validation failed: ${errorMessages}`, errors: formattedErrors });
  }

  // Extract user details from the request body
  const { userId, fullName, idNumber, accountNumber, password } = req.body;


  const database = client.db('APD'); // Database name
  const collection = database.collection('users'); // Collection name for users

  try {
    // Check for existing user by ID number
    const existingUser = await collection.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID number already exists' });
    }

    const saltRounds = 10; // Define the cost factor for salting
    const salt = await bcrypt.genSalt(saltRounds); // Generates a unique salt for each user
  
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = {
      userId, // Save userId to the database
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



app.get('/api/payments', async (req, res) => {
  const { accountNumber } = req.params;
  console.log("Received accountNumber:", accountNumber); // Debugging
  try {
    const database = client.db('APD');
    const collection = database.collection('PaymentForm');
    const userPayments = await collection.find({ accountNumber }).toArray();
    
    console.log("Payments found:", userPayments); // Debugging
    if (userPayments.length === 0) {
      return res.status(404).json({ message: 'No payment records found' });
    }

    res.status(200).json(userPayments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments', error });
  }
});


// POST endpoint to handle user login
app.post('/api/login', bruteForce.prevent,[
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('accountNumber').isNumeric().withMessage('Account number must be numeric'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract error messages and join them as a single string
    const errorMessages = errors.array().map(error => error.msg).join(', ');

    // Create an object with specific field errors
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    // Respond with a detailed error message and field-specific errors
    return res.status(400).json({ message: `Validation failed: ${errorMessages}`, errors: formattedErrors });
  }

  // Continue with login logic
  const { fullName, accountNumber, password } = req.body;

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


app.get('/api/payments/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log("Received userId:", userId); // Debugging
  try {
    const database = client.db('APD');
    const collection = database.collection('PaymentForm');
    const userPayments = await collection.find({ userId }).toArray();
    res.status(200).json(userPayments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments', error });
  }
});


let server = https.createServer(options, app)
console.log(port)
server.listen(port)


