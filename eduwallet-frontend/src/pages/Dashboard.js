import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaWallet, FaGift, FaUsers, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  // Sample data for charts
  const mealCreditData = [
    { name: 'Jan', credits: 4000 },
    { name: 'Feb', credits: 3000 },
    { name: 'Mar', credits: 2000 },
    { name: 'Apr', credits: 2780 },
    { name: 'May', credits: 1890 },
    { name: 'Jun', credits: 2390 },
  ];

  const voucherData = [
    { name: 'Jan', vouchers: 240 },
    { name: 'Feb', vouchers: 139 },
    { name: 'Mar', vouchers: 980 },
    { name: 'Apr', vouchers: 390 },
    { name: 'May', vouchers: 480 },
    { name: 'Jun', vouchers: 380 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaWallet className="text-4xl text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-bold">Meal Credits</h2>
            <p className="text-gray-600">1,200 credits</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaGift className="text-4xl text-green-500 mr-4" />
          <div>
            <h2 className="text-xl font-bold">Vouchers Distributed</h2>
            <p className="text-gray-600">320 vouchers</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaUsers className="text-4xl text-purple-500 mr-4" />
          <div>
            <h2 className="text-xl font-bold">Students</h2>
            <p className="text-gray-600">45 students</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaChartLine className="text-4xl text-orange-500 mr-4" />
          <div>
            <h2 className="text-xl font-bold">Usage Analytics</h2>
            <p className="text-gray-600">View reports</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Meal Credits Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mealCreditData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="credits" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Vouchers Distributed</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={voucherData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vouchers" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Activity</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">2023-10-01</td>
              <td className="p-2">Voucher Redeemed</td>
              <td className="p-2">John Doe redeemed a meal voucher.</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">2023-10-02</td>
              <td className="p-2">Meal Credits Added</td>
              <td className="p-2">500 credits added to your wallet.</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">2023-10-03</td>
              <td className="p-2">New Student Added</td>
              <td className="p-2">Jane Smith was added to the system.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Dashboard;