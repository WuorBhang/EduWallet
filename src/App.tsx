import React, { useState, useEffect } from 'react';
import { Wallet, History, QrCode, Plus, School, UtensilsCrossed, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from './lib/supabase';
import type { Database } from './lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Wallet = Database['public']['Tables']['wallets']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type MealSchedule = Database['public']['Tables']['meal_schedules']['Row'];

function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mealSchedules, setMealSchedules] = useState<MealSchedule[]>([]);
  const [activeTab, setActiveTab] = useState('wallet');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (profileData) {
      setProfile(profileData);
    }

    // Fetch wallet
    const { data: walletData } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (walletData) {
      setWallet(walletData);
      
      // Fetch transactions
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', walletData.id)
        .order('created_at', { ascending: false });
      
      if (transactionData) {
        setTransactions(transactionData);
      }
    }

    // Fetch meal schedules
    const { data: scheduleData } = await supabase
      .from('meal_schedules')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (scheduleData) {
      setMealSchedules(scheduleData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-8">
            <School className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">EduMeal Wallet</h1>
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-800">EduMeal Wallet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {profile?.student_id ? `Student ID: ${profile.student_id}` : profile?.role}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Available Balance</h2>
            <UtensilsCrossed className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-indigo-600 mb-4">
            {wallet ? formatCurrency(wallet.balance) : '$0.00'}
          </div>
          <div className="flex space-x-4">
            <button 
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
              onClick={() => {/* Add funds logic */}}
            >
              <Plus className="h-5 w-5" />
              <span>Add Funds</span>
            </button>
            <button 
              className="flex-1 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-50 transition-colors"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCode className="h-5 w-5" />
              <span>{showQR ? 'Hide QR Code' : 'Show QR Code'}</span>
            </button>
          </div>
          {showQR && wallet && (
            <div className="mt-4 flex justify-center">
              <QRCodeSVG
                value={JSON.stringify({
                  walletId: wallet.id,
                  studentId: profile?.student_id,
                  timestamp: new Date().toISOString()
                })}
                size={200}
                level="H"
                includeMargin
              />
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 ${activeTab === 'wallet' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('wallet')}
          >
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </div>
          </button>
          <button
            className={`px-6 py-3 ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>History</span>
            </div>
          </button>
        </div>

        {/* Transaction History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {transaction.type === 'credit' ? 'Credit Added' : 'Meal Redemption'}
                      </h3>
                      <p className="text-sm text-gray-500">{transaction.location}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Features */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Daily Meal Schedule</h3>
              <div className="space-y-3">
                {mealSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex justify-between items-center">
                    <span className="text-gray-600">{schedule.meal_type}</span>
                    <span className="text-sm font-medium text-indigo-600">
                      {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })} - {new Date(`2000-01-01T${schedule.end_time}`).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Nutritional Balance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Allowance</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {wallet ? formatCurrency(wallet.daily_allowance) : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Allowance</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {wallet ? formatCurrency(wallet.weekly_allowance) : '$0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;