import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_URL = (() => {
    const base = String(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  })();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Add transaction and trigger refresh across all pages
  const addTransaction = useCallback(async (transactionData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/transactions`, transactionData, getAuthHeaders());
      
      // Trigger global refresh
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  }, [API_URL]);

  // Fetch all transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/transactions`, getAuthHeaders());
      
      if (res?.data) {
        const normalized = res.data.map(t => ({
          ...t,
          type: t.type === "income" ? "Income" : "Expense",
          amount: Number(t.amount)
        }));
        setTransactions(normalized);
      }
      return res.data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }, [API_URL]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      let curReport = null;
      let lastReport = null;
      let txRes = null;

      try {
        curReport = await axios.get(`${API_URL}/reports`, {
          ...getAuthHeaders(),
          params: { period: 'Current Month' },
        });
      } catch (e) {
        console.error('Dashboard current report failed:', e);
      }

      try {
        lastReport = await axios.get(`${API_URL}/reports`, {
          ...getAuthHeaders(),
          params: { period: 'Last Month' },
        });
      } catch (e) {
        console.error('Dashboard last report failed:', e);
      }

      try {
        txRes = await axios.get(`${API_URL}/transactions`, {
          ...getAuthHeaders(),
          params: (() => {
            const end = new Date();
            const start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
            return { startDate: start.toISOString(), endDate: end.toISOString() };
          })(),
        });
      } catch (e) {
        console.error('Dashboard transactions failed:', e);
      }

      const dashData = {
        currentSummary: curReport?.data?.summary || { totalIncome: 0, totalExpense: 0, netBalance: 0, totalTransactions: 0 },
        lastSummary: lastReport?.data?.summary || { totalIncome: 0, totalExpense: 0, netBalance: 0, totalTransactions: 0 },
        expenseByCategory: curReport?.data?.expenseByCategory || {},
        transactions: Array.isArray(txRes?.data) ? txRes.data : [],
      };

      setDashboardData(dashData);
      return dashData;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }, [API_URL]);

  const value = {
    transactions,
    dashboardData,
    refreshTrigger,
    addTransaction,
    fetchTransactions,
    fetchDashboardData,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
