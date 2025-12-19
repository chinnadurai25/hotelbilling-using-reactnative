// QR Code generation utility
// Generate UPI payment QR code data

export const generateUPIQRData = (amount, merchantUPI = 'your-shop@paytm', merchantName = 'Food Shop') => {
  // UPI payment URL format
  const upiUrl = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Food Order Payment')}`;
  return upiUrl;
};

export const generateBillQRData = (orderId, amount, items) => {
  // Alternative: Generate QR with order details
  const billData = {
    orderId,
    amount,
    items: items.map(item => ({ id: item.id, name: item.name, qty: item.quantity })),
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(billData);
};


