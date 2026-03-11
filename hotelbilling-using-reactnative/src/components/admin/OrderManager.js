import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialOrders = [
  { id: '#ORD-092', table: 'T-02', items: 'Burger x2, Coke', total: 45, status: 'Pending' },
  { id: '#ORD-093', table: 'T-05', items: 'Pizza, Sprite', total: 35, status: 'Preparing' },
  { id: '#ORD-094', table: 'T-08', items: 'Pasta x2', total: 55, status: 'Completed' },
  { id: '#ORD-095', table: 'T-01', items: 'Salad, Water', total: 20, status: 'Pending' },
];

const OrderCard = ({ order, theme }) => {
  const [status, setStatus] = useState(order.status);
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Colors based on status
  const getStatusColor = (currentStatus) => {
    switch(currentStatus) {
      case 'Pending': return theme.warning;
      case 'Preparing': return theme.secondary;
      case 'Completed': return theme.success;
      default: return theme.subText;
    }
  };

  const handleStatusChange = () => {
    const nextStatus = status === 'Pending' ? 'Preparing' : status === 'Preparing' ? 'Completed' : 'Completed';
    if(nextStatus !== status) {
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start(() => setStatus(nextStatus));
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={[styles.orderId, { color: theme.text }]}>{order.id}</Text>
          <View style={[styles.tableBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={{ color: theme.primary, fontSize: 12, fontWeight: 'bold' }}>{order.table}</Text>
          </View>
        </View>
        <Text style={[styles.total, { color: theme.primary }]}>${order.total}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Ionicons name="restaurant-outline" size={16} color={theme.subText} />
        <Text style={[styles.items, { color: theme.subText }]} numberOfLines={1}>{order.items}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
          <Text style={{ color: getStatusColor(status), fontWeight: 'bold', fontSize: 13 }}>{status}</Text>
        </View>
        
        {status !== 'Completed' && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: getStatusColor(status) }]}
            onPress={handleStatusChange}
          >
            <Text style={styles.actionText}>
              {status === 'Pending' ? 'Start Preparing' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const OrderManager = ({ theme }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Orders</Text>
      
      {initialOrders.map((order) => (
        <OrderCard key={order.id} order={order} theme={theme} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  tableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  items: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  }
});

export default OrderManager;
