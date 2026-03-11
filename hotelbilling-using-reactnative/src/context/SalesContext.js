import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const SalesContext = createContext();

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sales from backend on mount
    const initSales = async () => {
      try {
        const savedSales = await api.getOrders();
        setSales(savedSales);
      } catch (error) {
        console.error('Error loading sales:', error);
      } finally {
        setLoading(false);
      }
    };
    initSales();
  }, []);

  const addSale = async (order) => {
    try {
      const orderToSave = {
        ...order,
        date: new Date().toISOString().split('T')[0]
      };
      const newOrder = await api.placeOrder(orderToSave);
      setSales(prevSales => [newOrder, ...prevSales]);
      return newOrder;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return sales.filter(sale => sale.date === today);
  };

  const getSalesByDate = (date) => {
    return sales.filter(sale => sale.date === date);
  };

  const getTodayTotal = () => {
    const todaySales = getTodaySales();
    return todaySales.reduce((total, sale) => total + sale.totalAmount, 0);
  };

  const getTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.totalAmount, 0);
  };

  const value = {
    sales,
    addSale,
    getTodaySales,
    getSalesByDate,
    getTodayTotal,
    getTotalSales,
    loading
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};


