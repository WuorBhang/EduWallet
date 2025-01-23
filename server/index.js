import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import axios from 'axios';
import User from './models/User.js';
import Wallet from './models/Wallet.js';
import Transaction from './models/Transaction.js';
import MealSchedule from './models/MealSchedule.js';

const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edumeal';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;

const stripe = new Stripe(STRIPE_SECRET_KEY);

mongoose.connect(MONGODB_URI);

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Auth routes
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User profile route
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    const transactions = await Transaction.find({ walletId: wallet._id })
      .sort({ createdAt: -1 });
    const mealSchedules = await MealSchedule.find().sort({ startTime: 1 });

    res.send({
      profile: req.user,
      wallet,
      transactions,
      mealSchedules
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Stripe payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// M-Pesa STK Push
app.post('/api/mpesa/stkPush', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Get M-Pesa access token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    const accessToken = tokenResponse.data.access_token;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    // Initiate STK Push
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: '254712345678', // Customer phone number
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: '254712345678', // Customer phone number
        CallBackURL: 'https://your-callback-url.com/mpesa/callback',
        AccountReference: 'EduMeal',
        TransactionDesc: 'Add funds to wallet',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    res.send({ success: true, data: response.data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// M-Pesa callback
app.post('/api/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful, update wallet
      // Implementation depends on your business logic
    }
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});