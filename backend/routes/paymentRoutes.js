const express = require('express');
const { payWithPaypal, payWithStripe, payWithMpesa } = require('../controllers/paymentController');
const router = express.Router();

router.post('/paypal', payWithPaypal);
router.post('/stripe', payWithStripe);
router.post('/mpesa', payWithMpesa);

module.exports = router;
