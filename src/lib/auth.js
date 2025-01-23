import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function signIn(email, password) {
  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
  return { token, user };
}

export async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}