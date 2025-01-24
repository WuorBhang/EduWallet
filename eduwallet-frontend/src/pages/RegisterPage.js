import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope, FaLock, FaSchool } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'parent', // Default role
      schoolCode: '', // Required for parents
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      role: Yup.string().required('Role is required'),
      schoolCode: Yup.string().when('role', {
        is: 'parent',
        then: Yup.string().required('School code is required for parents'),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const response = await register(values);
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } catch (error) {
        alert('Registration failed. Please try again.');
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {/* Name Field */}
        <div className="mb-4">
          <label className="flex items-center border rounded p-2">
            <FaUser className="text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="ml-2 outline-none flex-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
          </label>
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="flex items-center border rounded p-2">
            <FaEnvelope className="text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="ml-2 outline-none flex-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </label>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="flex items-center border rounded p-2">
            <FaLock className="text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="ml-2 outline-none flex-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </label>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>

        {/* Role Field */}
        <div className="mb-4">
          <label className="flex items-center border rounded p-2">
            <FaSchool className="text-gray-500" />
            <select
              name="role"
              className="ml-2 outline-none flex-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
            >
              <option value="parent">Parent</option>
              <option value="school">School</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {formik.touched.role && formik.errors.role ? (
            <div className="text-red-500 text-sm">{formik.errors.role}</div>
          ) : null}
        </div>

        {/* School Code Field (Conditional) */}
        {formik.values.role === 'parent' && (
          <div className="mb-4">
            <label className="flex items-center border rounded p-2">
              <FaSchool className="text-gray-500" />
              <input
                type="text"
                name="schoolCode"
                placeholder="School Code"
                className="ml-2 outline-none flex-1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.schoolCode}
              />
            </label>
            {formik.touched.schoolCode && formik.errors.schoolCode ? (
              <div className="text-red-500 text-sm">{formik.errors.schoolCode}</div>
            ) : null}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </motion.div>
  );
};

export default RegisterPage;