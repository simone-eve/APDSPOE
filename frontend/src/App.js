import React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import PaymentForm from './PaymentForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
{/* //___________code attribution___________
//The following code was taken from Create-a-react-app
//Author: Create-a-react-app
//Link: https://create-react-app.dev/docs/adding-a-router/ */}
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/PaymentForm" element={<PaymentForm />} /> {/* Correct component here */}
          </Routes>
        </header>
      </div>
    </Router>
    
  );
}

export default App;
