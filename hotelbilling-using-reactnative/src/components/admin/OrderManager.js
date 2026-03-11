import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';

const OrderCard = ({ order, theme, onUpdateStatus, onDeleteOrder }) => {
  const [loading, setLoading] = useState(false);
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

  const handleStatusChange = async () => {
    const nextStatus = status === 'Pending' ? 'Preparing' : 'Completed';
    if(nextStatus !== status) {
        setLoading(true);
        try {
            await onUpdateStatus(order._id || order.id, nextStatus);
            setStatus(nextStatus);
        } catch (e) {
            console.error('Update status error:', e);
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.orderIdRow}>
            <Text style={[styles.orderId, { color: theme.text }]}>#{order.orderId?.split('-')[1] || order._id?.slice(-4) || 'N/A'}</Text>
            <View style={[styles.typeBadge, { backgroundColor: order.orderType === 'Online' ? theme.secondary : theme.primary }]}>
              <Ionicons 
                  name={order.orderType === 'Online' ? 'bicycle' : 'restaurant'} 
                  size={12} 
                  color={order.orderType === 'Online' ? '#FFF' : '#FFF'} 
              />
              <Text style={[styles.typeText, { color: '#FFF' }]}>
                  {order.orderType === 'Online' ? 'ONLINE DELIVERY' : 'DINE-IN'}
              </Text>
            </View>
          </View>
          
          {order.user?.name && (
            <View style={styles.customerNameContainer}>
              <Ionicons name="person-outline" size={13} color={theme.subText} />
              <Text style={[styles.customerName, { color: theme.subText }]}>{order.user.name}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.total, { color: theme.primary }]}>₹{order.totalAmount || order.total}</Text>
          <TouchableOpacity 
            style={{ marginTop: 5, padding: 5 }} 
            onPress={() => onDeleteOrder(order._id || order.id)}
          >
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name={order.orderType === 'Online' ? 'location-outline' : 'grid-outline'} size={14} color={theme.subText} />
        <Text style={[styles.locationText, { color: theme.subText }]}>
          {order.orderType === 'Online' ? order.location : `Table ${order.table || 'N/A'}`}
        </Text>
        <View style={styles.dotSeparator} />
        <Ionicons name={order.paymentMethod === 'Cash' ? 'cash-outline' : 'qr-code-outline'} size={14} color={theme.subText} />
        <Text style={[styles.locationText, { color: theme.subText }]}>{order.paymentMethod || 'UPI'}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Ionicons name="restaurant-outline" size={16} color={theme.subText} />
        <Text style={[styles.items, { color: theme.subText }]} numberOfLines={1}>
            {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ') || 'No items'}
        </Text>
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastNotifiedOrderId = useRef(null);

  React.useEffect(() => {
    fetchOrders(true);
    
    // Polling for new orders every 10 seconds
    const interval = setInterval(() => {
        fetchOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (isInitial = false) => {
    try {
      const data = await api.getOrders();
      const reversedData = [...data].reverse();
      
      // Check for new orders to notify (if not initial fetch)
      if (!isInitial && reversedData.length > 0) {
          const latestOrder = reversedData[0];
          const latestId = latestOrder._id || latestOrder.id;
          
          if (lastNotifiedOrderId.current && lastNotifiedOrderId.current !== latestId) {
              const newOrderCount = reversedData.length - orders.length;
              if (newOrderCount > 0) {
                  require('react-native').Alert.alert(
                    'New Order Received! 🔔',
                    `You have ${newOrderCount} new order(s). \nLatest: #${latestOrder.orderId?.split('-')[1] || 'N/A'}`,
                    [{ text: 'OK' }]
                  );
              }
          }
          lastNotifiedOrderId.current = latestId;
      } else if (isInitial && reversedData.length > 0) {
          lastNotifiedOrderId.current = reversedData[0]._id || reversedData[0].id;
      }
      
      setOrders(reversedData);
    } catch (error) {
      if (isInitial) console.error('Error fetching orders:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      fetchOrders();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const deleteOrderHandler = (id) => {
    require('react-native').Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
             try {
               await api.deleteOrder(id);
               fetchOrders();
             } catch (e) {
               console.error('Failed to delete order:', e);
             }
          }
        }
      ]
    );
  };

  if (loading) return <Text style={{ padding: 20, color: theme.subText }}>Loading active orders...</Text>;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Active Orders</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Ionicons name="refresh" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
      
      {orders.length === 0 ? (
        <Text style={{ textAlign: 'center', color: theme.subText, marginVertical: 20 }}>No active orders.</Text>
      ) : (
        orders.map((order) => (
          <OrderCard 
            key={order._id || order.id} 
            order={order} 
            theme={theme} 
            onUpdateStatus={updateOrderStatus}
            onDeleteOrder={deleteOrderHandler}
          />
        ))
      )}
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CCC',
    marginHorizontal: 4,
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
