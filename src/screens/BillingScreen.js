import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { useCart } from '../context/CartContext';
import { useSales } from '../context/SalesContext';
import { generateUPIQRData } from '../utils/qrGenerator';

const BillingScreen = () => {
  const navigation = useNavigation();
  const { cart, getTotalAmount, clearCart } = useCart();
  const { addSale } = useSales();
  const [merchantUPI] = useState('your-shop@paytm'); // Replace with actual UPI ID

  const totalAmount = getTotalAmount();
  const qrData = generateUPIQRData(totalAmount, merchantUPI, 'Food Shop');

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    try {
      const order = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalAmount,
        paymentMethod: 'UPI',
      };

      await addSale(order);
      await clearCart();

      Alert.alert(
        'Order Completed!',
        `Order placed successfully. Total: ₹${totalAmount}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset navigation stack to Menu screen
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
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Summary</Text>
        </View>

        <View style={styles.itemsContainer}>
          {cart.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>₹{totalAmount}</Text>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan to Pay via GPay</Text>
          <QRCodeDisplay value={qrData} size={250} />
          <Text style={styles.qrNote}>
            Scan the QR code above to open GPay with the payment amount pre-filled
          </Text>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
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
});

export default BillingScreen;

