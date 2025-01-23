const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

exports.redeemVoucher = async (req, res) => {
    const { wallet_id, amount } = req.body;

    try {
        // Find the wallet
        const wallet = await Wallet.findById(wallet_id);
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Check if the wallet has enough balance
        if (wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct the amount from the wallet
        wallet.balance -= amount;
        await wallet.save();

        // Create a new transaction for the redemption
        const transaction = new Transaction({
            wallet_id: wallet._id,
            amount,
            transaction_type: 'debit',
            payment_method: 'Voucher',
        });

        await transaction.save();

        res.status(200).json({ 
            message: 'Voucher redeemed successfully', 
            new_balance: wallet.balance 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to redeem voucher', details: error.message });
    }
};
