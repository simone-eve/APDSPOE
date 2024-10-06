import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [fullName, setFullName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Regex patterns for whitelisting
    const nameRegex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
    const accountNumberRegex = /^[0-9]*$/; // Allows only numbers

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Validation before sending the request
        if (!nameRegex.test(fullName)) {
            setError('Full Name can only contain letters and spaces.');
            return;
        }
        if (!accountNumberRegex.test(accountNumber)) {
            setError('Account Number can only contain digits.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, accountNumber, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login, navigate to dashboard
                navigate('/dashboard');
            } else {
                // Handle error, e.g., show a message to the user
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to login. Please try again.');
        }
    };

    // Input handlers with validation
    const handleFullNameChange = (e) => {
        if (nameRegex.test(e.target.value)) {
            setFullName(e.target.value);
        } else {
            setError('Full Name can only contain letters and spaces.');
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
