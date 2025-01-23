import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, required: true, default: 0, min: 0 },
  dailyAllowance: { type: Number, required: true, default: 0, min: 0 },
  weeklyAllowance: { type: Number, required: true, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Wallet', walletSchema);