import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import FoodImage from '../FoodImage';

const MenuItem = ({ item, theme, onAddToCart }) => (
  <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
    <FoodImage imageUrl={item.imageUrl} style={styles.image} />
    <View style={styles.details}>
      <View style={styles.row}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <View style={[styles.badge, { backgroundColor: (item.type || 'Veg') === 'Veg' ? theme.success + '20' : theme.danger + '20' }]}>
          <Text style={{ color: (item.type || 'Veg') === 'Veg' ? theme.success : theme.danger, fontSize: 10, fontWeight: 'bold' }}>
            {item.type || 'Veg'}
          </Text>
        </View>
      </View>
      <Text style={[styles.category, { color: theme.subText }]}>{item.category} • ₹{item.price}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
          onPress={() => onAddToCart(item)}
        >
          <Ionicons name="cart-outline" size={18} color={theme.primary} />
          <Text style={[styles.actionText, { color: theme.primary }]}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.background }]}>
          <Ionicons name="create-outline" size={18} color={theme.primary} />
          <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: theme.background }]}
          onPress={() => {
            Alert.alert(
              'Delete Item',
              `Are you sure you want to delete ${item.name}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onAddToCart(item, true) }
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
          <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const MenuManager = ({ theme }) => {
  const [menuItems, setMenuItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { addToCart } = useCart();

  React.useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await api.getFood();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu in manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (item) => {
    try {
      await api.deleteFood(item._id || item.id);
      fetchMenu();
      Alert.alert('Success', 'Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  if (loading) return <Text style={{ padding: 20, color: theme.subText }}>Loading menu...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Menu Management</Text>
        <TouchableOpacity onPress={fetchMenu}>
          <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {menuItems.length === 0 ? (
        <Text style={{ textAlign: 'center', color: theme.subText, marginVertical: 20 }}>No items found.</Text>
      ) : (
        menuItems.map(item => (
          <MenuItem 
            key={item._id || item.id} 
            item={item} 
            theme={theme} 
            onAddToCart={(it, isDelete) => isDelete ? deleteItem(it) : addToCart(it)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  category: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  }
});

export default MenuManager;
