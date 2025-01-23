import React, { useState, useEffect } from 'react';
import { Wallet, History, QrCode, Plus, School, UtensilsCrossed, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentModal from './components/PaymentModal';

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [mealSchedules, setMealSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('wallet');
  const [showQR, setShowQR] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ... previous useEffect and functions remain the same ...

  const handlePaymentSuccess = async (amount) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      const data = await response.json();
      setWallet(data.wallet);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error updating wallet data:', error);
    }
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
      currency: "USD"
    }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Previous JSX remains the same */}
        
        {/* Add Funds button in the wallet card */}
        <div className="flex space-x-4">
          <button 
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
            onClick={() => setShowPaymentModal(true)}
          >
            <Plus className="h-5 w-5" />
            <span>Add Funds</span>
          </button>
          {/* ... other buttons ... */}
        </div>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </PayPalScriptProvider>
  );
}

export default App;