import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => (
  <div className="min-h-screen flex flex-col md:flex-row">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
