import React from 'react';
import './App.css';
import PaymentForm from './PaymentForm'; // Import the PaymentForm component
import Dashboard from './Dashboard'; // Import the PaymentForm component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes and Route


// const App = () => {
//   return (
//     <Router>
//     <div>
//       <Routes>
//         <Route exact path = "/" element = {<PaymentForm />} />
//         <Route path = "/dashboard" element = {<Dashboard />} />
//       </Routes>
//     </div>
//     </Router>
//   );
// };

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Dashboard /> 
      </header>
    </div>
  );
}


export default App;
