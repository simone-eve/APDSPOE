import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Regex patterns for whitelisting
  const nameRegex = /^[a-zA-Z\s]*$/; // Allows letters and spaces
  const idNumberRegex = /^[0-9]*$/; // Allows digits only
  const accountNumberRegex = /^[0-9]*$/; // Allows digits only for account number

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      // Send data to the backend for registration
      const response = await axios.post('http://localhost:3000/api/register', {
        fullName,
        idNumber,
        accountNumber,
        password,
      });
      if (response.status === 201) {
        setSuccess('Registration successful!');
        // Optionally, reset the form or redirect the user
      }
    } catch (error) {
      // Display the specific error message from the backend
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
    }
  };

  // Input validation with whitelisting
  const handleFullNameChange = (e) => {
    if (nameRegex.test(e.target.value)) {
      setFullName(e.target.value);
    } else {
      setError('Full Name can only contain letters and spaces.');
    }
  };

  const handleIdNumberChange = (e) => {
    if (idNumberRegex.test(e.target.value)) {
      setIdNumber(e.target.value);
    } else {
      setError('ID Number can only contain digits.');
    }
  };

  const handleAccountNumberChange = (e) => {
    if (accountNumberRegex.test(e.target.value)) {
      setAccountNumber(e.target.value);
    } else {
      setError('Account Number can only contain digits.');
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
            required
          />
        </div>
        <div>
          <label>ID Number:</label>
          <input
            type="text"
            value={idNumber}
            onChange={handleIdNumberChange}
            required
          />
        </div>
        <div>
          <label>Account Number:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit">Register</button>

        <button onClick={() => navigate("/Login")}>Login</button>
      </form>
    </div>
  );
};

export default Register;
