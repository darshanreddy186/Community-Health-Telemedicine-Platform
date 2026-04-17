import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Chat from './pages/Chat';
import Records from './pages/Records';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={
            <PrivateRoute>
              <Navbar />
              <div className="p-4 max-w-5xl mx-auto">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/chat/:roomId" element={<Chat />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
              <Chatbot />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
