import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/dashboard/home';
import DashboardLayout from './layouts/dashboard';
import SignIn from './pages/auth/sign-in';


function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />

      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route path="home" element={<Home />} />
      </Route>

      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
