const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
});

module.exports = mongoose.model('Wallet', walletSchema);
