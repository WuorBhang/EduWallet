import React, { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from '@stripe/stripe-js';
import { X } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleStripePayment = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount) * 100 }), // Convert to cents
      });
      
      const { clientSecret } = await response.json();
      const result = await stripe.confirmCardPayment(clientSecret);
      
      if (result.error) {
        alert(result.error.message);
      } else {
        onSuccess(amount);
        onClose();
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleMpesaPayment = async () => {
    try {
      const response = await fetch('/api/mpesa/stkPush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Please check your phone to complete the payment');
      } else {
        alert('Payment initiation failed');
      }
    } catch (error) {
      console.error('M-Pesa payment failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Funds</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`w-full p-3 border rounded-lg flex items-center justify-center ${
                paymentMethod === 'stripe' ? 'border-indigo-500 bg-indigo-50' : ''
              }`}
            >
              Credit Card (Stripe)
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`w-full p-3 border rounded-lg flex items-center justify-center ${
                paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : ''
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setPaymentMethod('mpesa')}
              className={`w-full p-3 border rounded-lg flex items-center justify-center ${
                paymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-50' : ''
              }`}
            >
              M-Pesa
            </button>
          </div>
        </div>

        {paymentMethod === 'paypal' && amount && (
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount,
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              onSuccess(amount);
              onClose();
            }}
          />
        )}

        {paymentMethod === 'stripe' && amount && (
          <button
            onClick={handleStripePayment}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Pay with Card
          </button>
        )}

        {paymentMethod === 'mpesa' && amount && (
          <button
            onClick={handleMpesaPayment}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Pay with M-Pesa
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;