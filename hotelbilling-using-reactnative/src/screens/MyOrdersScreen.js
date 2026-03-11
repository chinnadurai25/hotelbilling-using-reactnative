import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.getUserOrders(user.id || user._id);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FF9800';
      case 'Preparing': return theme.primary;
      case 'Completed': return '#4CAF50';
      case 'Cancelled': return theme.danger;
      default: return theme.subText;
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderId, { color: theme.text }]}>{item.orderId}</Text>
          <Text style={[styles.orderDate, { color: theme.subText }]}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {item.items.map((food, index) => (
        <View key={index} style={styles.foodItem}>
          <Text style={[styles.foodName, { color: theme.text }]}>{food.name} x {food.quantity}</Text>
          <Text style={[styles.foodPrice, { color: theme.subText }]}>₹{food.price * food.quantity}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.orderFooter}>
        <Text style={[styles.totalLabel, { color: theme.subText }]}>Total Amount</Text>
        <Text style={[styles.totalAmount, { color: theme.primary }]}>₹{item.totalAmount}</Text>
      </View>
      
      {item.table && (
        <View style={styles.tableInfo}>
          <Ionicons name="restaurant-outline" size={14} color={theme.subText} />
          <Text style={[styles.tableText, { color: theme.subText }]}>Table: {item.table}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color={theme.danger} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={80} color={theme.subText + '40'} />
          <Text style={[styles.emptyText, { color: theme.subText }]}>No orders found yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  logoutBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  orderCard: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#00000010',
    marginVertical: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 14,
  },
  foodPrice: {
    fontSize: 14,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  tableText: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 15,
  },
});

export default MyOrdersScreen;
