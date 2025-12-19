import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeDisplay = ({ value, size = 200 }) => {
  if (!value) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.placeholderText}>No QR code data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCode
        value={value}
        size={size}
        color="#000"
        backgroundColor="#fff"
        logoSize={30}
        logoMargin={2}
        logoBorderRadius={15}
        logoBackgroundColor="transparent"
      />
      <Text style={styles.instruction}>
        Scan this QR code to pay via GPay
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 20,
  },
  placeholder: {
    height: 200,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  instruction: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default QRCodeDisplay;


