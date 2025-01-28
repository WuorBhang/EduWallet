const paypal = require('paypal-rest-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.payWithPaypal = (req, res) => {
    const { amount, currency } = req.body;

    const payment = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        transactions: [{ amount: { total: amount, currency }, description: 'Add balance' }],
        redirect_urls: {
            return_url: 'http://localhost:5000/success',
            cancel_url: 'http://localhost:5000/cancel',
        },
    };

    paypal.payment.create(payment, (err, payment) => {
        if (err) {
            res.status(500).json({ error: 'PayPal payment failed', details: err });
        } else {
            res.json({ approval_url: payment.links[1].href });
        }
    });
};

exports.payWithStripe = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: 'Stripe payment failed', details: err });
    }
};

exports.payWithMpesa = async (req, res) => {
    res.status(200).json({ message: 'M-Pesa payment simulated' });
};
