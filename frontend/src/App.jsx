// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';

import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import OnboardingDetail from './pages/OnboardingDetail';
import SignIn from './pages/SignIn';
import MainHome from './pages/MainHome';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/2" element={<OnboardingDetail />} />
        <Route path="/signin" element={<SignIn />} />
        {/* Protected Route for the Thesis Interface */}
        <Route path="/home" element={user ? <MainHome /> : <Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;