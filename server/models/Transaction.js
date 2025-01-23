import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  location: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);