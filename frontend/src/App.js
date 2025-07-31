import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Clients from './components/pages/Clients';
import Visitors from './components/pages/Visiteurs';
import Subscriptions from './components/pages/Subscriptions';
import Sales from './components/pages/Sales';
import Payments from './components/pages/Payments';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/visitors" element={<Visitors />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
