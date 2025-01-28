const Wallet = require('../models/Wallet');

exports.createWallet = async (req, res) => {
    const { user_id, currency } = req.body;

    try {
        const wallet = new Wallet({ user_id, currency });
        await wallet.save();
        res.status(201).json({ wallet_id: wallet._id, balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ error: 'Wallet creation failed', details: err });
    }
};
