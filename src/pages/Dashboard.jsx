
import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import RetailerDashboard from './RetailerDashboard';
import NGODashboard from './NGODashboard';

const Dashboard = () => {
  const { isRetailer, isNGO } = useAuth();

  return (
    <DashboardLayout>
      {isRetailer && <RetailerDashboard />}
      {isNGO && <NGODashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
