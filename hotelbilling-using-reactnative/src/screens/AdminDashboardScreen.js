import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QuickStats from '../components/admin/QuickStats';
import TableManager from '../components/admin/TableManager';
import AddFoodItem from '../components/admin/AddFoodItem';
import MenuManager from '../components/admin/MenuManager';
import OrderManager from '../components/admin/OrderManager';
import Analytics from '../components/admin/Analytics';
import BestSelling from '../components/admin/BestSelling';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Active section state for better mobile UX instead of one giant scroll if preferred,
  // but we can just show them all in a ScrollView as per requirements.
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Admin Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: theme.subText }]}>Hotel Billing Management</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-circle" size={40} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const tabs = ['Overview', 'Tables', 'Orders', 'Menu', 'Analytics'];

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            activeTab === tab && [styles.activeTabButton, { backgroundColor: theme.primary + '20' }]
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[
            styles.tabText,
            { color: theme.subText },
            activeTab === tab && [styles.activeTabText, { color: theme.primary }]
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <Animated.ScrollView 
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTabs()}

        {activeTab === 'Overview' && (
          <>
            <QuickStats theme={theme} />
            <BestSelling theme={theme} />
          </>
        )}
        
        {activeTab === 'Tables' && <TableManager theme={theme} />}
        
        {activeTab === 'Orders' && <OrderManager theme={theme} />}
        
        {activeTab === 'Menu' && (
          <>
            <AddFoodItem theme={theme} />
            <MenuManager theme={theme} />
          </>
        )}
        
        {activeTab === 'Analytics' && <Analytics theme={theme} />}

      </Animated.ScrollView>

      {/* Floating Action Button */}
      {activeTab !== 'Menu' && (
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => setActiveTab('Menu')}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// Colors for modern glassmorphism and gradient effects
const lightTheme = {
  background: '#F4F7FE',
  cardBg: '#FFFFFF',
  text: '#1B2559',
  subText: '#A3AED0',
  primary: '#4318FF',
  secondary: '#39B8FF',
  success: '#01B574',
  danger: '#EE5D50',
  warning: '#FFCE20',
  border: '#E0E5F2',
  cardOverlay: 'rgba(255, 255, 255, 0.7)',
};

const darkTheme = {
  background: '#0B1437',
  cardBg: '#111C44',
  text: '#FFFFFF',
  subText: '#A3AED0',
  primary: '#7551FF',
  secondary: '#39B8FF',
  success: '#01B574',
  danger: '#EE5D50',
  warning: '#FFCE20',
  border: '#111C44',
  cardOverlay: 'rgba(17, 28, 68, 0.7)',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EE5D50',
  },
  profileIcon: {
    marginLeft: 12,
  },
  tabsContainer: {
    marginTop: 10,
    marginBottom: 20,
    maxHeight: 45,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTabButton: {
    // Background color applied dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});

export default AdminDashboardScreen;
