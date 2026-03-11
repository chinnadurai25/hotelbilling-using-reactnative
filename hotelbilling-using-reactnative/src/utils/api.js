const API_BASE_URL = 'http://10.109.252.223:5000'; // Replace with your local IP if needed

export const api = {
  getFood: async () => {
    const response = await fetch(`${API_BASE_URL}/api/food`);
    return response.json();
  },
  addFood: async (foodData) => {
    const response = await fetch(`${API_BASE_URL}/api/food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData),
    });
    return response.json();
  },
  uploadImage: async (imageUri) => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('photo', { uri: imageUri, name: filename, type });

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    return response.json();
  },
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    return response.json();
  },
  placeOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }
};
