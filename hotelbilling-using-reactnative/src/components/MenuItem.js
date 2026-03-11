import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodImage from './FoodImage';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <View style={styles.container}>
      <FoodImage 
        imageUrl={item.imageUrl} 
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>₹{item.price}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="add-circle" size={24} color="#FF6B6B" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});

export default MenuItem;


