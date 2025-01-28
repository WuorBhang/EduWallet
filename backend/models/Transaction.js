const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    transaction_type: { type: String, enum: ['credit', 'debit'], required: true },
    timestamp: { type: Date, default: Date.now },
    payment_method: { type: String, enum: ['M-Pesa', 'PayPal', 'Stripe', 'Voucher'], required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);
