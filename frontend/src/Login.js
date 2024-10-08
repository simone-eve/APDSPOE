import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [fullName, setFullName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
 //___________code attribution___________
//The following code was taken from RexEgg
//Author:  RexEgg
//Link: https://www.rexegg.com/regex-quickstart.php
    // Regex patterns for whitelisting
    const nameRegex = /^[a-zA-Z\s]*$/; 
    const accountNumberRegex = /^[0-9]*$/; 
    const passwordRegex = /^[A-Za-z\d@$!%*#?&]{8,}$/;
//___________end___________

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

        if (!passwordRegex.test(password)) {
            setError('Password must be 8 digits.');
            return;
        }


        try {
            const response = await fetch('https://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, accountNumber, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Store accountNumber and userId in local storage
                localStorage.setItem('accountNumber', accountNumber); // Store accountNumber
                localStorage.setItem('userId', data.userId); // Store userId from the response
                navigate('/dashboard'); // Navigate to dashboard
            } else {
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
