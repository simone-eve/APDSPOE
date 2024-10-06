import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  // Sample data for the payments table
  const payments = [
    {
      id: 1,
      amount: 1000,
      recipient: 'John Doe',
      bank: 'Bank of America',
      verification: 'Verified',
      date: '2024-09-30 10:30 AM',
    },
    {
      id: 2,
      amount: 2000,
      recipient: 'Jane Smith',
      bank: 'Wells Fargo',
      verification: 'Pending',
      date: '2024-09-29 09:00 AM',
    },
    // Add more payment data as needed
  ];

  return (
    <div className="dashboard">
      <h3>User Payments Dashboard</h3>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Recipient Name</th>
            <th>Bank Name</th>
            <th>Verification</th>
            <th>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>${payment.amount}</td>
              <td>{payment.recipient}</td>
              <td>{payment.bank}</td>
              <td>{payment.verification}</td>
              <td>{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={()=>navigate("/PaymentForm")}>Make New Payment</button>
    </div>
  );
};

export default Dashboard;
