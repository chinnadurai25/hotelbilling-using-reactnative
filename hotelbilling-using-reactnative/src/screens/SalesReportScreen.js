import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSales } from '../context/SalesContext';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SalesReportScreen = () => {
  const { sales } = useSales();
  const [displaySales, setDisplaySales] = useState([]);
  const [selectedDate, setSelectedDate] = useState('today');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const { logout } = useAuth();

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setDisplaySales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSales();
  }, []);

  const getFilteredSales = () => {
    if (selectedDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return displaySales.filter(sale => sale.date === today);
    }
    return displaySales;
  };

  const salesToDisplay = getFilteredSales();
  const summarySales = getFilteredSales(); // For totals

  const todayTotal = displaySales
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const allTimeTotal = displaySales.reduce((sum, s) => sum + s.totalAmount, 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const todayOrdersCount = displaySales.filter(s => s.date === new Date().toISOString().split('T')[0]).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sales Report</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.summaryLabel, { color: theme.subText }]}>Today's Revenue</Text>
          <Text style={[styles.summaryAmount, { color: theme.primary }]}>₹{todayTotal}</Text>
          <Text style={[styles.summaryCount, { color: theme.subText }]}>{todayOrdersCount} orders</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.summaryLabel, { color: theme.subText }]}>All Time Revenue</Text>
          <Text style={[styles.summaryAmount, { color: theme.primary }]}>₹{allTimeTotal}</Text>
          <Text style={[styles.summaryCount, { color: theme.subText }]}>{sales.length} orders</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: theme.cardBg, borderColor: theme.border }, selectedDate === 'today' && [styles.activeTab, { backgroundColor: theme.primary, borderColor: theme.primary }]]}
          onPress={() => setSelectedDate('today')}
        >
          <Text style={[styles.tabText, { color: theme.subText }, selectedDate === 'today' && styles.activeTabText]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: theme.cardBg, borderColor: theme.border }, selectedDate === 'all' && [styles.activeTab, { backgroundColor: theme.primary, borderColor: theme.primary }]]}
          onPress={() => setSelectedDate('all')}
        >
          <Text style={[styles.tabText, { color: theme.subText }, selectedDate === 'all' && styles.activeTabText]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView 
          style={styles.salesList}
          contentContainerStyle={styles.salesListContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
          }
        >
          {salesToDisplay.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color={theme.subText} />
              <Text style={[styles.emptyText, { color: theme.subText }]}>No sales data available</Text>
            </View>
          ) : (
            salesToDisplay.map((sale, index) => (
              <View key={sale._id || sale.orderId || index} style={[styles.saleCard, { backgroundColor: theme.cardBg }]}>
                <View style={[styles.saleHeader, { borderBottomColor: theme.border }]}>
                  <View>
                    <Text style={[styles.orderId, { color: theme.text }]}>Order #{sale.orderId?.split('-')[1] || 'N/A'}</Text>
                    <Text style={[styles.orderDate, { color: theme.subText }]}>
                      {formatDate(sale.date || sale.timestamp)} at {formatTime(sale.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.orderTotal, { color: theme.primary }]}>₹{sale.totalAmount}</Text>
                </View>
                <View style={styles.itemsList}>
                  {sale.items?.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.itemRow}>
                      <Text style={[styles.itemName, { color: theme.subText }]}>
                        {item.name} x{item.quantity}
                      </Text>
                      <Text style={[styles.itemPrice, { color: theme.text }]}>
                        ₹{item.price * item.quantity}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 12,
    color: '#999',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  salesList: {
    flex: 1,
  },
  salesListContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  saleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  itemsList: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default SalesReportScreen;


