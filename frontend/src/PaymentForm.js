import React, { useState } from 'react';
import './PaymentForm.css'; // Import the CSS file

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [provider, setProvider] = useState('SWIFT');
    const [recipientName, setRecipientName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [swiftCode, setSwiftCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        console.log({ amount, currency, provider, recipientName, accountNumber, bankName, swiftCode });
    };

    return (
        <div className="PaymentForm">
            <h1>International Payment Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Currency:
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            {/* Add more currencies as needed */}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Payment Provider:
                        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                            <option value="SWIFT">SWIFT</option>
                            {/* Add more providers as needed */}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Recipient's Full Name:
                        <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Recipient's Account Number:
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Bank Name (optional):
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        SWIFT/BIC Code:
                        <input
                            type="text"
                            value={swiftCode}
                            onChange={(e) => setSwiftCode(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default PaymentForm;
