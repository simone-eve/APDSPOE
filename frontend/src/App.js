import React from 'react';
import './App.css';
import PaymentForm from './PaymentForm'; // Import the PaymentForm component
import Dashboard from './Dashboard'; // Import the PaymentForm component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PaymentForm /> Render the PaymentForm component
        <Dashboard /> {/* Render the PaymentForm component */}
      </header>
    </div>
  );
}

export default App;
