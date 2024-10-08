import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [payments, setPayments] = useState([]); // State to store payments
  const [loading, setLoading] = useState(true); // State to track loading
  const navigate = useNavigate();

  // Get accountNumber from local storage
  const accountNumber = localStorage.getItem('accountNumber'); 

  // Fetch payments for the logged-in user
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log("Fetching payments for accountNumber:", accountNumber); // Debugging
        const response = await fetch(`http://localhost:3000/api/payments/${accountNumber}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        
        const data = await response.json();
        console.log("Fetched payments data:", data); // Debugging
        setPayments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [accountNumber]);
  

  if (loading) {
    return <div>Loading payments...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="dashboard">
        
      
      <h3>User Payments Dashboard</h3>
      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Recipient Name</th>
              <th>Account Number</th>
              <th>Bank Name</th>
              <th>SWIFT Code</th>
              <th>Verification</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>${payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.provider}</td>
                <td>{payment.recipientName}</td>
                <td>{payment.accountNumber}</td>
                <td>{payment.bankName}</td>
                <td>{payment.swiftCode}</td>
                <td>{payment.verification}</td>
                <td>{new Date(payment.dateTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment records found.</p>
      )}
      <button onClick={() => navigate("/PaymentForm")}>Make New Payment</button>
    </div>
  );
};

export default Dashboard;
