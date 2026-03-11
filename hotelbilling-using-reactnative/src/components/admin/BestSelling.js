import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, ActivityIndicator } from 'react-native';
import { api } from '../../utils/api';
import FoodImage from '../FoodImage';

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
      <FoodImage imageUrl={item.imageUrl} style={styles.image} />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.itemStats, { color: theme.subText }]}>
          {item.orders} orders • ₹{item.revenue}
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
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const [orders, food] = await Promise.all([
        api.getOrders(),
        api.getFood()
      ]);

      const itemStats = {};

      orders.forEach(order => {
        order.items?.forEach(item => {
          const id = item._id || item.id || item.name;
          if (!itemStats[id]) {
            itemStats[id] = { 
              name: item.name, 
              orders: 0, 
              revenue: 0,
              imageUrl: food.find(f => f.name === item.name)?.imageUrl
            };
          }
          itemStats[id].orders += item.quantity;
          itemStats[id].revenue += (item.price * item.quantity);
        });
      });

      const sorted = Object.values(itemStats)
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      setTopItems(sorted);
    } catch (error) {
      console.error('Error calculating best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxOrders = topItems.length > 0 ? Math.max(...topItems.map(i => i.orders)) : 0;

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Best Selling Items</Text>
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        {topItems.length === 0 ? (
          <Text style={{ color: theme.subText, textAlign: 'center' }}>No sales data yet.</Text>
        ) : (
          topItems.map((item, index) => (
            <BestSellingItem 
              key={index} 
              item={item} 
              theme={theme} 
              index={index} 
              maxOrders={maxOrders} 
            />
          ))
        )}
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
