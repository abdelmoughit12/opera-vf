import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/sharedCompoents/Dashboard';
import Clients from './components/pages/Clients';
import ClientDetailsPage from './components/client/ClientDetailsPage';
import Visitors from './components/pages/Visiteurs';
import Sales from './components/pages/Sales';
import Settings from './components/pages/Settings';
import EditClientModal from './components/client/edit/EditClientModal';
import NotificationProvider from './components/common/NotificationProvider';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/client/:id" element={<ClientDetailsPage />} />
            <Route path="/client/:id/edit" element={<EditClientModal />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/visitors" element={<Visitors />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
