const express = require('express');
const { createWallet } = require('../controllers/walletController');
const router = express.Router();

router.post('/create', createWallet);

module.exports = router;
