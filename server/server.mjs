
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
const port = process.env.PORT || 3000;
//___________code attribution___________
//The following code was taken from APDS7311 Lab Guide updated (2).pdf
//Author: Varsity College
//Link: null
const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
}
 //___________end___________


app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined')); 
app.use(express.json());

//___________code attribution___________
//The following code was taken from Medium
//Author: Naren Zadafiya
//Link: https://medium.com/@zadafiya/how-to-connect-mongodb-with-node-js-a-comprehensive-guide-cdf4d099ae9b
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
 //___________end___________

 //___________code attribution___________
//The following code was taken from Medium
//Author: Roman Voloboev
//Link: https://medium.com/@animirr/brute-force-protection-node-js-examples-cd58e8bd9b8d
const store = new ExpressBrute.MemoryStore(); 
const bruteForce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 60 * 60 * 1000,  
  maxWait: 60 * 60 * 1000, 
  lifetime: 60 * 60, 
});
 //___________end___________

  //___________code attribution___________
//The following code was taken from Medium
//Author: Code Miner
//Link: https://medium.com/learn-to-earn/use-express-api-rate-limit-nodejs-63c75990763a#:~:text=Express%20API%20rate%20limit%20functions,and%20mitigating%20potential%20security%20threats.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to specific routes
app.use('/api/register', apiLimiter); 
app.use('/api/login', apiLimiter); 
app.use('/api/payments', apiLimiter); 
 //___________end___________


app.post('/api/register', bruteForce.prevent,  [
 //___________code attribution___________
//The following code was taken from Medium
//Author: Chau Nguyen
//Link: https://howtodevez.medium.com/using-express-validator-for-data-validation-in-nodejs-6946afd9d67e#:~:text=express%2Dvalidator%20is%20a%20package,to%20validate%20API%20request%20parameters.
  body('userId').notEmpty().withMessage('User ID is required'),
  body('fullName').isString().withMessage('Full name must be a string'),
  body('idNumber').isLength({ min: 13, max: 13 }).withMessage('ID number must be 13 characters long'),
  body('accountNumber').isNumeric().withMessage('Account number must be numeric'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
   //___________end___________
], async (req, res) => {

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract error messages and join them as a single string
    const errorMessages = errors.array().map(error => error.msg).join(', ');

    
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    
    return res.status(400).json({ message: `Validation failed: ${errorMessages}`, errors: formattedErrors });
  }

  // Extract user details from the request body
  const { userId, fullName, idNumber, accountNumber, password } = req.body;


  const database = client.db('APD'); 
  const collection = database.collection('users'); 

  try {
    // Check for existing user by ID number
    const existingUser = await collection.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID number already exists' });
    }

    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds); // Generates a unique salt for each user
  
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = {
      userId,
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
      userId: req.body.userId  // Accept userId, or set to null
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
app.post('/api/login', bruteForce.prevent,[
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('accountNumber').isNumeric().withMessage('Account number must be numeric'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
   
    const errorMessages = errors.array().map(error => error.msg).join(', ');

  
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

   
    return res.status(400).json({ message: `Validation failed: ${errorMessages}`, errors: formattedErrors });
  }


  const { fullName, accountNumber, password } = req.body;

  const database = client.db('APD'); 
  const collection = database.collection('users');

  try {
    
    const user = await collection.findOne({ accountNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
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


