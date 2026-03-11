import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartProvider, useCart } from './src/context/CartContext';
import { SalesProvider } from './src/context/SalesContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import BillingScreen from './src/screens/BillingScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import SalesReportScreen from './src/screens/SalesReportScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Auth Stack ---
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// --- Customer View ---
function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: true, title: 'My Cart' }} />
      <Stack.Screen name="Billing" component={BillingScreen} options={{ headerShown: true, title: 'Checkout' }} />
    </Stack.Navigator>
  );
}

function CustomerTabs() {
  const { theme } = useTheme();
  const { getTotalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'MenuTab') iconName = focused ? 'restaurant' : 'restaurant-outline';
          else if (route.name === 'CartTab') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'MyOrders') iconName = focused ? 'receipt' : 'receipt-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
        tabBarStyle: { backgroundColor: theme.cardBg, borderTopColor: theme.border },
        headerShown: false,
      })}
    >
      <Tab.Screen name="MenuTab" component={MenuStack} options={{ title: 'Menu' }} />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{ 
          title: 'Cart',
          tabBarBadge: getTotalItems() > 0 ? getTotalItems() : null 
        }} 
      />
      <Tab.Screen name="MyOrders" component={MyOrdersScreen} options={{ title: 'Tracking' }} />
    </Tab.Navigator>
  );
}

// --- Admin View ---
function AdminTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'TotalSales') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
        tabBarStyle: { backgroundColor: theme.cardBg, borderTopColor: theme.border },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ title: 'Manage' }} />
      <Tab.Screen name="TotalSales" component={SalesReportScreen} options={{ title: 'Analytics', headerShown: true }} />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : user.role === 'admin' ? (
          <Stack.Screen name="AdminRoot" component={AdminTabs} />
        ) : (
          <Stack.Screen name="CustomerRoot" component={CustomerTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <SalesProvider>
            <RootNavigation />
          </SalesProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

