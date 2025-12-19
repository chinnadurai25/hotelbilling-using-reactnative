import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@food_shop_cart';
const SALES_KEY = '@food_shop_sales';

// Cart storage functions
export const saveCart = async (cart) => {
  try {
    const jsonValue = JSON.stringify(cart);
    await AsyncStorage.setItem(CART_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving cart:', e);
  }
};

export const loadCart = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CART_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading cart:', e);
    return [];
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (e) {
    console.error('Error clearing cart:', e);
  }
};

// Sales storage functions
export const saveSales = async (sales) => {
  try {
    const jsonValue = JSON.stringify(sales);
    await AsyncStorage.setItem(SALES_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving sales:', e);
  }
};

export const loadSales = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SALES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading sales:', e);
    return [];
  }
};

export const addSale = async (order) => {
  try {
    const sales = await loadSales();
    const newSales = [...sales, order];
    await saveSales(newSales);
    return newSales;
  } catch (e) {
    console.error('Error adding sale:', e);
    return [];
  }
};


