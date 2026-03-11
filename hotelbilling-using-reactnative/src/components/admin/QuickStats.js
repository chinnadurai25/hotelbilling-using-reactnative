import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';

const AnimatedNumber = ({ value, prefix = '', suffix = '', style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [value]);

  // Interpolate the animated value to a string
  const animatedText = animatedValue.interpolate({
    inputRange: [0, value],
    outputRange: ['0', value.toString()],
  });

  // Because React Native Animated.Text can't easily format numbers with commas in interpolate,
  // For a real app, reanimated is better, but here we can just display the raw interpolated integer.
  // We'll use a listener approach for better formatting if needed, but a simple interpolate works for demo.
  
  return (
    <Text style={style}>
        {prefix}
        <Animated.Text>{animatedText}</Animated.Text>
        {suffix}
    </Text>
  );
};

// A small functional component for a single card
const StatCard = ({ theme, title, value, prefix, suffix, icon, color, delay }) => {
  const slideUp = useRef(new Animated.Value(50)).current;
  const fadeOut = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeOut, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.cardBg,
          transform: [{ translateY: slideUp }],
          opacity: fadeOut,
          shadowColor: color
        }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, { color: theme.subText }]}>{title}</Text>
        <AnimatedNumber 
          value={value} 
          prefix={prefix} 
          suffix={suffix} 
          style={[styles.cardValue, { color: theme.text }]} 
        />
      </View>
    </Animated.View>
  );
};

const QuickStats = ({ theme }) => {
  const [stats, setStats] = React.useState({
    todayRevenue: 0,
    todayOrders: 0,
    allTimeRevenue: 0,
    allTimeOrders: 0
  });

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const orders = await api.getOrders();
      const today = new Date().toISOString().split('T')[0];
      
      const todayOrders = orders.filter(o => o.date === today);
      const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const allTimeRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        todayRevenue,
        todayOrders: todayOrders.length,
        allTimeRevenue,
        allTimeOrders: orders.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Overview</Text>
      <View style={styles.grid}>
        <StatCard 
          theme={theme}
          title="Today's Revenue"
          value={stats.todayRevenue}
          prefix="₹"
          icon="cash"
          color={theme.primary}
          delay={100}
        />
        <StatCard 
          theme={theme}
          title="Today's Orders"
          value={stats.todayOrders}
          icon="cart"
          color={theme.secondary}
          delay={200}
        />
        <StatCard 
          theme={theme}
          title="All Time Revenue"
          value={stats.allTimeRevenue}
          prefix="₹"
          icon="stats-chart"
          color={theme.success}
          delay={300}
        />
        <StatCard 
          theme={theme}
          title="Total Orders"
          value={stats.allTimeOrders}
          icon="receipt"
          color={theme.warning}
          delay={400}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: 'column',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  }
});

export default QuickStats;
