import exp from 'constants';
import express from 'express';
import mongoose from 'mongoose';
import User from './user.models.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/admin")
  .then(() => {
    console.log("connected");
  });

const client = new OAuth2Client('34925859579-4v6uiruln3n916jplcot70rsg9di9crl.apps.googleusercontent.com');

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existinguser = await User.findOne({ email });

  if (existinguser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedpass = await bcrypt.hash(password, 10);
  const createuser = new User({
    name,
    email,
    password: hashedpass,
  });
  await createuser.save();
  res.status(200).json({ message: 'User created successfully' });
});

// Google OAuth Route
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '34925859579-4v6uiruln3n916jplcot70rsg9di9crl.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        name,
        email,
        googleId, // Save the Google ID
        password: '', // No password for Google users
      });
      await user.save();
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(500).json({ message: 'Error logging in with Google' });
  }
});

// Normal Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If login is successful
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log("app is listening on PORT 5000");
});



hello i am abdullah what are you doing