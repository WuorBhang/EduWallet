import React, { useEffect, useState } from 'react';
import { getWallet } from '../services/walletService';

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      const data = await getWallet();
      setWallet(data);
    };
    fetchWallet();
  }, []);

  return (
    <div>
      <h1>Wallet</h1>
      {wallet ? (
        <div>
          <p>Balance: {wallet.balance} credits</p>
          <p>Last Transaction: {wallet.lastTransaction}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WalletPage;