import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartProvider } from './src/context/CartContext';
import { SalesProvider } from './src/context/SalesContext';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import BillingScreen from './src/screens/BillingScreen';
import SalesReportScreen from './src/screens/SalesReportScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MenuStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{ title: 'Food Menu' }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <Stack.Screen 
        name="Billing" 
        component={BillingScreen}
        options={{ title: 'Billing & Payment' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MenuTab') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Sales') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="MenuTab" 
        component={MenuStack}
        options={{ title: 'Menu' }}
      />
      <Tab.Screen 
        name="Sales" 
        component={SalesReportScreen}
        options={{ title: 'Sales Report' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <SalesProvider>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </SalesProvider>
    </CartProvider>
  );
}

