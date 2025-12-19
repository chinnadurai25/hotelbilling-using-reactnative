# Food Shop Mobile Application

A React Native mobile application for a food shop with menu management, shopping cart, billing, QR code payment integration, and daily sales reporting.

## Features

- **Menu System**: Browse food items by category (Breakfast, Lunch, Dinner)
- **Shopping Cart**: Add items, manage quantities, and view cart
- **Billing & Payment**: Generate QR code for GPay payment
- **Sales Report**: View daily sales and revenue reports
- **High-Quality Images**: Beautiful food images loaded from Unsplash
- **Local Storage**: All data stored locally using AsyncStorage

## Menu Items

### Breakfast
- Idly Set - ₹20
- Poori Set - ₹40
- Dosa Set - ₹30
- Tea - ₹10
- Coffee - ₹15
- Vada - ₹10

### Lunch
- Meals - ₹60
- Porota Set - ₹40
- Biryani - ₹80
- Fried Rice - ₹50
- Curry Rice - ₹45

### Dinner
- Same items as Breakfast

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on Android/iOS:
```bash
npm run android
# or
npm run ios
```

## Configuration

### UPI Payment Setup

Edit `src/screens/BillingScreen.js` and update the `merchantUPI` variable with your actual UPI ID:

```javascript
const [merchantUPI] = useState('your-shop@paytm'); // Replace with your UPI ID
```

## Project Structure

```
shop/
├── App.js                    # Main app entry point
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/              # Screen components
│   ├── context/              # State management
│   ├── data/                 # Menu data and storage
│   └── utils/                # Utility functions
```

## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage
- React Native QR Code SVG
- Expo Image

## License

MIT


