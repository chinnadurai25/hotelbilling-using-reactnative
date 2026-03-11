// For Android Emulator, use 'http://192.168.1.6:5000'
// For Physical Device, use your computer's LAN IP (e.g., 'http://192.168.1.x:5000')
const API_BASE_URL = process.env.EXPO_PUBLIC_VITE_API_URL || 'http://localhost:5000';

export const api = {
  getFood: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/food`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('getFood error:', e.message, 'at', API_BASE_URL);
      throw e;
    }
  },
  addFood: async (foodData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('addFood error:', e.message);
      throw e;
    }
  },
  uploadImage: async (imageUri) => {
    try {
      console.log('Uploading to:', `${API_BASE_URL}/upload`);
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('photo', { uri: imageUri, name: filename, type });

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: { 'content-type': 'multipart/form-data' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('uploadImage error:', e.message);
      throw e;
    }
  },
  getOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('getOrders error:', e.message);
      throw e;
    }
  },
  placeOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('placeOrder error:', e.message);
      throw e;
    }
  },
  deleteOrder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('deleteOrder error:', e.message);
      throw e;
    }
  },
  deleteFood: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/food/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('deleteFood error:', e.message);
      throw e;
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('updateOrderStatus error:', e.message);
      throw e;
    }
  },
  getTables: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tables`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('getTables error:', e.message);
      throw e;
    }
  },
  addTable: async (tableData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('addTable error:', e.message);
      throw e;
    }
  },
  updateTable: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('updateTable error:', e.message);
      throw e;
    }
  },
  deleteTable: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('deleteTable error:', e.message);
      throw e;
    }
  },
  // Auth methods
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (e) {
      console.error('api.login error:', e.message);
      throw e;
    }
  },
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      return data;
    } catch (e) {
      console.error('api.signup error:', e.message);
      throw e;
    }
  },
  getUserOrders: async (userId) => {
    try {
      const url = `${API_BASE_URL}/api/orders/user/${userId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error('getUserOrders error:', e.message);
      throw e;
    }
  }
};
