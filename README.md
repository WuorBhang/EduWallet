# EduWallet Backend

The **EduWallet** backend provides a secure, scalable, and efficient platform for managing wallets, distributing food vouchers or meal credits, and integrating digital payment options like PayPal, Stripe, and M-Pesa. This backend ensures children receive daily meals while attending school, fostering both education and nutrition.

## Features

- User registration and authentication (Admin, Teachers, Parents).
- Wallet creation and balance management.
- Digital payment integration:
  - **PayPal**
  - **Stripe**
  - **M-Pesa**
- Voucher generation and redemption.
- Transaction history management.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: Database for storing users, wallets, and transactions.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Stripe API**: Payment gateway integration.
- **PayPal API**: Payment gateway integration.
- **dotenv**: For managing environment variables.

---

## Installation

### Prerequisites

- **Node.js** and **npm** installed on your system.
- **MongoDB** installed locally or access to a MongoDB Atlas cluster.
- Stripe and PayPal accounts for API keys.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/WuorBhang/EduWallet
   cd eduwallet
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the environment variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eduwallet
   STRIPE_SECRET_KEY=sk_test_yourStripeSecretKeyHere
   PAYPAL_CLIENT_ID=yourPaypalClientID
   PAYPAL_SECRET=yourPaypalSecret
   MPESA_CONSUMER_KEY=yourMpesaConsumerKey
   MPESA_CONSUMER_SECRET=yourMpesaConsumerSecret
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

---

## API Endpoints

### **Authentication**

- **POST** `/api/users/register`  
  Registers a new user (Admin, Teacher, Parent).

- **POST** `/api/users/login`  
  Logs in a user and returns a JSON Web Token (JWT).

### **Wallet Management**

- **POST** `/api/wallets/create`  
  Creates a wallet for a user.

- **POST** `/api/wallets/add-balance`  
  Adds balance to a wallet via digital payments.

- **GET** `/api/wallets/balance/:userId`  
  Fetches the wallet balance of a specific user.

### **Payment Integration**

- **POST** `/api/payments/stripe`  
  Handles Stripe payments.

- **POST** `/api/payments/paypal`  
  Handles PayPal payments.

- **POST** `/api/payments/mpesa`  
  Simulates M-Pesa payments.

### **Voucher Management**

- **POST** `/api/vouchers/generate`  
  Generates food voucher codes.

- **POST** `/api/vouchers/redeem`  
  Redeems a voucher and deducts the equivalent balance from a wallet.

---

## Project Structure

``` backend/
├── models/               # Mongoose schemas
│   ├── User.js
│   ├── Wallet.js
│   └── Transaction.js
├── routes/               # Express routes
│   ├── userRoutes.js
│   ├── authRoutes.js
│   ├── walletRoutes.js
│   └── voucherRoutes.js
├── controllers/          # Route handlers
│   ├── userController.js
│   ├── authController.js
│   ├── walletController.js
│   └── voucherController.js

├── config/               # Configuration files
│   └── db.js
├── .env                  # Environment variables
├── server.js             # Main server file
└── package.json          # Project metadata and dependencies
```

---

## Running Tests

To run tests (if implemented):

```bash
npm test
```

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributions

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## Contact

For any inquiries or support, reach out to:

- **Name**: Wuor Bhang and Keith Kadima
- **Email**: [uhuribhang211@gmail.com](mailto:uhuribhang211@gmail.com) and [keithkadima@gmail.com](mailto:keithkadima@gmail.com)
- **GitHub**: [github.com/WuorBhang](https://github.com/WuorBhang)

---

Feel free to adjust any part of the file (e.g., contact information or [repository link](https://github.com/WuorBhang/EduWallet)) as needed!
