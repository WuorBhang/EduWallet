import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/">EduWallet</Link>
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/vouchers">Vouchers</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;