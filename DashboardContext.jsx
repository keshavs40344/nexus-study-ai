// src/contexts/DashboardContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { toast } from 'react-hot-toast';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5 * 60 * 1000); // 5 minutes

  const refreshDashboard = useCallback(async (userConfig, schedule) => {
    if (!userConfig || !schedule) return;
    
    setIsLoading(true);
    try {
      const data = await dashboardService.getDashboardSummary(userConfig, schedule);
      setDashboardData(data);
      setLastUpdated(new Date());
      
      // Schedule next refresh
      setTimeout(() => refreshDashboard(userConfig, schedule), refreshInterval);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast.error('Failed to update dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [refreshInterval]);

  const updateRefreshInterval = useCallback((interval) => {
    setRefreshInterval(interval);
  }, []);

  const forceRefresh = useCallback(async (userConfig, schedule) => {
    dashboardService.clearCache();
    await refreshDashboard(userConfig, schedule);
    toast.success('Dashboard refreshed');
  }, [refreshDashboard]);

  const getInsights = useCallback(async (userId, startDate, endDate) => {
    return await dashboardService.getStudyInsights(userId, startDate, endDate);
  }, []);

  const exportDashboardData = useCallback(() => {
    if (!dashboardData) return null;
    
    const exportData = {
      ...dashboardData,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Dashboard data exported');
    return exportData;
  }, [dashboardData]);

  const value = {
    dashboardData,
    isLoading,
    lastUpdated,
    refreshDashboard,
    forceRefresh,
    updateRefreshInterval,
    getInsights,
    exportDashboardData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
