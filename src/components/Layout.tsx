import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import FriendsPage from '../pages/FriendsPage';

export default function Layout() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:userId?" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}