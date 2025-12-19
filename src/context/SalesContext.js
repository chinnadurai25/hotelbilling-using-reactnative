import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadSales, addSale as addSaleToStorage } from '../data/storage';

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
    // Load sales from storage on mount
    const initSales = async () => {
      const savedSales = await loadSales();
      setSales(savedSales);
      setLoading(false);
    };
    initSales();
  }, []);

  const addSale = async (order) => {
    const orderWithId = {
      ...order,
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };
    const updatedSales = await addSaleToStorage(orderWithId);
    setSales(updatedSales);
    return orderWithId;
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


