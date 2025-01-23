const express = require('express');
const { redeemVoucher } = require('../controllers/voucherController');
const router = express.Router();

// Redeem Voucher
router.post('/redeem', redeemVoucher);

module.exports = router;
