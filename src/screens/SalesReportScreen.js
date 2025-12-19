import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSales } from '../context/SalesContext';
import { Ionicons } from '@expo/vector-icons';

const SalesReportScreen = () => {
  const { getTodaySales, getTodayTotal, getTotalSales, sales } = useSales();
  const [selectedDate, setSelectedDate] = useState('today');

  const todaySales = getTodaySales();
  const todayTotal = getTodayTotal();
  const allTimeTotal = getTotalSales();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSalesForView = () => {
    if (selectedDate === 'today') {
      return todaySales;
    }
    // For now, show all sales. Can be extended to filter by date
    return sales;
  };

  const displaySales = getSalesForView();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sales Report</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's Revenue</Text>
          <Text style={styles.summaryAmount}>₹{todayTotal}</Text>
          <Text style={styles.summaryCount}>{todaySales.length} orders</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>All Time Revenue</Text>
          <Text style={styles.summaryAmount}>₹{allTimeTotal}</Text>
          <Text style={styles.summaryCount}>{sales.length} orders</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedDate === 'today' && styles.activeTab]}
          onPress={() => setSelectedDate('today')}
        >
          <Text style={[styles.tabText, selectedDate === 'today' && styles.activeTabText]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedDate === 'all' && styles.activeTab]}
          onPress={() => setSelectedDate('all')}
        >
          <Text style={[styles.tabText, selectedDate === 'all' && styles.activeTabText]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.salesList}
        contentContainerStyle={styles.salesListContent}
      >
        {displaySales.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No sales data available</Text>
          </View>
        ) : (
          displaySales.map((sale, index) => (
            <View key={sale.orderId || index} style={styles.saleCard}>
              <View style={styles.saleHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{sale.orderId?.split('-')[1] || 'N/A'}</Text>
                  <Text style={styles.orderDate}>
                    {formatDate(sale.date || sale.timestamp)} at {formatTime(sale.timestamp)}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>₹{sale.totalAmount}</Text>
              </View>
              <View style={styles.itemsList}>
                {sale.items?.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.name} x{item.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ₹{item.price * item.quantity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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


