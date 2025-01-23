# EduMeal Wallet

A modern digital wallet system for educational institutions that enables students to manage their meal allowances and make payments using multiple payment methods.

![EduMeal Wallet](https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200)

## Features

- 💳 Digital Wallet Management
- 🔐 Role-based Access Control (Student, Parent, Staff, Admin)
- 📱 Multiple Payment Methods:
  - Stripe (Credit/Debit Cards)
  - PayPal
  - M-Pesa (Mobile Money)
- 📊 Detailed Transaction History
- 📅 Meal Schedule Management
- 📱 QR Code Generation for Quick Payments
- 💰 Daily and Weekly Allowance Tracking

## Tech Stack

- **Frontend:**
  - React.js with Vite
  - Tailwind CSS for styling
  - Lucide React for icons
  - QR Code generation

- **Backend:**
  - Node.js with Express
  - MongoDB for database
  - JWT for authentication

- **Payment Integration:**
  - Stripe API
  - PayPal SDK
  - M-Pesa API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- API keys for payment services:
  - Stripe
  - PayPal
  - M-Pesa

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/edumeal-wallet.git
cd edumeal-wallet
```bash

1. Install dependencies:

```bash
npm install
```

1. Create a `.env` file in the root directory and add your environment variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# PayPal
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# M-Pesa
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey

# Server
PORT=3000
NODE_ENV=development
```

Replace the placeholders with your actual environment variables.

1. Start the server:

```bash
npm run dev
```

## Project Structure

``` edumeal-wallet/
├── src/
│   ├── components/
│   │   └── PaymentModal.jsx
│   ├── lib/
│   │   ├── mongodb.js
│   │   └── auth.js
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Wallet.js
│   │   ├── Transaction.js
│   │   └── MealSchedule.js
│   └── index.js
└── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User sign in

### User Profile

- `GET /api/user/profile` - Get user profile with wallet and transactions

### Payments

- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/mpesa/stkPush` - Initiate M-Pesa payment
- `POST /api/mpesa/callback` - M-Pesa payment callback

## Security Features

- JWT-based authentication
- Secure payment processing
- Role-based access control
- Environment variable protection
- API request validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [uhuribhang211@gmail.com](mailto:uhuribhang211@gmail.com) and [keithkadima@gmail.com](mailto:keithkadima@gmail.com)

## Acknowledgments

- [Stripe](https://stripe.com) for payment processing
- [PayPal](https://paypal.com) for payment integration
- [Safaricom](https://developer.safaricom.co.ke) for M-Pesa integration
- [MongoDB](https://mongodb.com) for database services
  