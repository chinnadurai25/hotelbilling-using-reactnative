import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

const topItems = [
  { id: 1, name: 'Spicy Chicken Burger', orders: 154, revenue: 1078, image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
  { id: 2, name: 'Margherita Pizza', orders: 120, revenue: 1440, image: 'https://cdn-icons-png.flaticon.com/512/3595/3595466.png' },
  { id: 3, name: 'Pasta Alfredo', orders: 98, revenue: 882, image: 'https://cdn-icons-png.flaticon.com/512/11550/11550426.png' },
  { id: 4, name: 'Chocolate Brownie', orders: 85, revenue: 425, image: 'https://cdn-icons-png.flaticon.com/512/5752/5752664.png' },
  { id: 5, name: 'Iced Latte', orders: 76, revenue: 304, image: 'https://cdn-icons-png.flaticon.com/512/1000/1000961.png' },
];

const BestSellingItem = ({ item, theme, index, maxOrders }) => {
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: (item.orders / maxOrders) * 100,
      duration: 1000,
      delay: index * 200,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.itemRow}>
      <Text style={[styles.rank, { color: theme.subText }]}>#{index + 1}</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.itemStats, { color: theme.subText }]}>
          {item.orders} orders • ${item.revenue}
        </Text>
        
        {/* Animated Bar Chart for volume */}
        <View style={[styles.barContainer, { backgroundColor: theme.primary + '20' }]}>
          <Animated.View 
            style={[
              styles.barFill, 
              { 
                backgroundColor: theme.primary,
                width: fillAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const BestSelling = ({ theme }) => {
  const maxOrders = Math.max(...topItems.map(i => i.orders));

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Best Selling Items</Text>
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        {topItems.map((item, index) => (
          <BestSellingItem 
            key={item.id} 
            item={item} 
            theme={theme} 
            index={index} 
            maxOrders={maxOrders} 
          />
        ))}
      </View>
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
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 25,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemStats: {
    fontSize: 12,
    marginBottom: 6,
  },
  barContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  }
});

export default BestSelling;
