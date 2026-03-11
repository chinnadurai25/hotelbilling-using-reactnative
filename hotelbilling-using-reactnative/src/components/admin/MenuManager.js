import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

// Backend Integration: Replace mockMenu with data from MongoDB API (useEffect fetch)
import { Ionicons } from '@expo/vector-icons';

const mockMenu = [
  { id: 1, name: 'Spicy Chicken Burger', price: 7.99, type: 'Non Veg', category: 'Lunch', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
  { id: 2, name: 'Veggie Supreme Pizza', price: 12.50, type: 'Veg', category: 'Dinner', image: 'https://cdn-icons-png.flaticon.com/512/3595/3595466.png' },
  { id: 3, name: 'Cappuccino', price: 4.50, type: 'Veg', category: 'Drinks', image: 'https://cdn-icons-png.flaticon.com/512/1000/1000961.png' },
  { id: 4, name: 'Club Sandwich', price: 6.99, type: 'Non Veg', category: 'Breakfast', image: 'https://cdn-icons-png.flaticon.com/512/11550/11550426.png' },
];

const MenuItem = ({ item, theme }) => (
  <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={styles.details}>
      <View style={styles.row}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <View style={[styles.badge, { backgroundColor: item.type === 'Veg' ? theme.success + '20' : theme.danger + '20' }]}>
          <Text style={{ color: item.type === 'Veg' ? theme.success : theme.danger, fontSize: 10, fontWeight: 'bold' }}>
            {item.type}
          </Text>
        </View>
      </View>
      <Text style={[styles.category, { color: theme.subText }]}>{item.category} • ${item.price}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.background }]}>
          <Ionicons name="create-outline" size={18} color={theme.primary} />
          <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.background }]}>
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
          <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const MenuManager = ({ theme }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Menu Management</Text>
        <Text style={{ color: theme.primary, fontWeight: 'bold' }}>View All</Text>
      </View>
      
      {mockMenu.map(item => (
        <MenuItem key={item.id} item={item} theme={theme} />
      ))}
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
