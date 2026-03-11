import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { useCart } from '../context/CartContext';
import { useSales } from '../context/SalesContext';
import { generateUPIQRData } from '../utils/qrGenerator';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const BillingScreen = () => {
  const navigation = useNavigation();
  const { cart, getTotalAmount, clearCart } = useCart();
  const { addSale } = useSales();
  const { user } = useAuth();
  const [merchantUPI] = useState('your-shop@paytm');
  const { theme, isDarkMode } = useTheme();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loadingTables, setLoadingTables] = useState(true);
  const [orderType, setOrderType] = useState('Offline'); // 'Offline' or 'Online'
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'Cash', 'Card'

  React.useEffect(() => {
    fetchFreeTables();
  }, [orderType]);

  const fetchFreeTables = async () => {
    if (orderType !== 'Offline') return;
    try {
      setLoadingTables(true);
      const data = await api.getTables();
      setTables(data.filter(t => t.status === 'Free'));
    } catch (e) {
      console.error('Error fetching tables:', e);
    } finally {
      setLoadingTables(false);
    }
  };

  const totalAmount = getTotalAmount();
  const qrData = generateUPIQRData(totalAmount, merchantUPI, 'Food Shop');

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    if (orderType === 'Offline' && !selectedTable) {
      Alert.alert('Error', 'Please select a table');
      return;
    }

    if (orderType === 'Online' && !location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    try {
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        items: cart.map(item => ({
          foodItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        orderType: orderType,
        location: orderType === 'Online' ? location : '',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        table: orderType === 'Offline' ? selectedTable.number : '',
        status: 'Pending',
        user: user?.id || user?._id // Include user ID
      };

      // Place order
      const result = await api.placeOrder(orderData);

      // Update table status if offline
      if (orderType === 'Offline' && selectedTable) {
        await api.updateTable(selectedTable._id, {
          status: 'Occupied',
          currentOrder: {
            orderId: orderData.orderId,
            totalAmount: totalAmount,
            items: cart.length,
            timestamp: new Date()
          }
        });
      }

      await clearCart();

      const successMsg = orderType === 'Offline' 
        ? `Order placed successfully for ${selectedTable.number}. Total: ₹${totalAmount}`
        : `Order placed successfully for ${location}. Total: ₹${totalAmount}`;

      Alert.alert(
        'Order Completed!',
        successMsg,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Menu' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete order. Please try again.');
      console.error('Error completing order:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Order Summary</Text>
        </View>

        <View style={[styles.itemsContainer, { backgroundColor: theme.cardBg }]}>
          {cart.map((item, index) => (
            <View key={item._id || item.id || index} style={[styles.orderItem, { borderBottomColor: theme.border }]}>
              <View style={styles.orderItemLeft}>
                <Text style={[styles.orderItemName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.orderItemQty, { color: theme.subText }]}>Qty: {item.quantity}</Text>
              </View>
              <Text style={[styles.orderItemPrice, { color: theme.primary }]}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.totalContainer, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount:</Text>
          <Text style={[styles.totalAmount, { color: theme.primary }]}>₹{totalAmount}</Text>
        </View>

        {/* Order Type Selection */}
        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Type</Text>
          <View style={styles.tabContainer}>
            {['Offline', 'Online'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.tabBtn,
                  { borderColor: theme.border },
                  orderType === type && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
                onPress={() => setOrderType(type)}
              >
                <Ionicons 
                  name={type === 'Offline' ? 'restaurant' : 'bicycle'} 
                  size={18} 
                  color={orderType === type ? '#FFF' : theme.subText} 
                />
                <Text style={[styles.tabBtnText, { color: orderType === type ? '#FFF' : theme.text }]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conditional Selection: Table or Location */}
        {orderType === 'Offline' ? (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Table</Text>
            {loadingTables ? (
              <ActivityIndicator color={theme.primary} />
            ) : tables.length === 0 ? (
              <Text style={{ color: theme.danger }}>No free tables available!</Text>
            ) : (
              <View style={styles.tableGrid}>
                {tables.map(t => (
                  <TouchableOpacity
                    key={t._id}
                    style={[
                      styles.tableChip, 
                      { borderColor: theme.border },
                      selectedTable?._id === t._id && { backgroundColor: theme.primary, borderColor: theme.primary }
                    ]}
                    onPress={() => setSelectedTable(t)}
                  >
                    <Text style={[
                        styles.tableChipText, 
                        { color: theme.text },
                        selectedTable?._id === t._id && { color: '#FFF' }
                    ]}>{t.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Location</Text>
            <TextInput
              style={[styles.locationInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="Enter your address/location"
              placeholderTextColor={theme.subText + '80'}
              value={location}
              onChangeText={setLocation}
              multiline
            />
          </View>
        )}

        {/* Payment Method Selection */}
        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
          <View style={styles.paymentGrid}>
            {[
              { id: 'UPI', icon: 'qr-code', label: 'UPI / GPay' },
              { id: 'Cash', icon: 'cash', label: 'Cash' },
              { id: 'Card', icon: 'card', label: 'Card' }
            ].map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentBtn,
                  { borderColor: theme.border },
                  paymentMethod === method.id && { borderColor: theme.primary, borderWidth: 2 }
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons name={method.icon} size={24} color={paymentMethod === method.id ? theme.primary : theme.subText} />
                <Text style={[styles.paymentLabel, { color: theme.text }]}>{method.label}</Text>
                {paymentMethod === method.id && (
                  <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dynamic QR Display */}
        {paymentMethod === 'UPI' && (
          <View style={[styles.qrContainer, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.qrTitle, { color: theme.text }]}>Scan to Pay via UPI</Text>
            <QRCodeDisplay value={qrData} size={250} backgroundColor={theme.cardBg} color={theme.text} />
            <Text style={[styles.qrNote, { color: theme.subText }]}>
              Scan the QR code above to open your UPI app with the amount pre-filled
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: theme.primary }]}
          onPress={handleCompleteOrder}
        >
          <Text style={styles.completeButtonText}>Complete Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemLeft: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderItemQty: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  qrNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  completeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tableChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tableChipText: {
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tabBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationInput: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    height: 80,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  paymentGrid: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  paymentBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  checkBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default BillingScreen;

