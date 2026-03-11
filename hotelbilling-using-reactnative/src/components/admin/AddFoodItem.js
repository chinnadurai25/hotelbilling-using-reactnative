import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { api } from '../../utils/api';

const AddFoodItem = ({ theme }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Lunch',
    type: 'Veg',
    description: '',
    prepTime: '',
    isAvailable: true,
    isPopular: false,
    image: null
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({...formData, image: result.assets[0].uri});
    }
  };

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];
  const types = ['Veg', 'Non Veg'];

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Please fill in Name and Price at least.');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = '';
      
      // Upload image first if exists
      if (formData.image) {
        const uploadRes = await api.uploadImage(formData.image);
        // Use the same base URL as the API
        const baseUrl = (process.env.EXPO_PUBLIC_VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        imageUrl = `${baseUrl}/uploads/${uploadRes.filename}`;
      }

      const foodData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
      };

      await api.addFood(foodData);
      
      Alert.alert('Success', 'Item added to menu successfully!');
      setFormData({
        name: '',
        price: '',
        category: 'Lunch',
        type: 'Veg',
        description: '',
        prepTime: '',
        isAvailable: true,
        isPopular: false,
        image: null
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add item. Check your connection.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, key, keyboard = 'default', multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.background, 
            color: theme.text, 
            borderColor: theme.border,
            height: multiline ? 80 : 50 
          }
        ]}
        value={value}
        onChangeText={(text) => setFormData({...formData, [key]: text})}
        placeholder={`Enter ${label}`}
        placeholderTextColor={theme.subText + '70'}
        keyboardType={keyboard}
        multiline={multiline}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Add New Food Item</Text>
      
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        {/* Image Upload Row */}
        <TouchableOpacity 
          style={[styles.imageUpload, { backgroundColor: theme.background, borderColor: theme.border }]}
          onPress={pickImage}
        >
          {formData.image ? (
            <Image source={{ uri: formData.image }} style={styles.previewImage} />
          ) : (
            <>
              <Ionicons name="camera" size={32} color={theme.primary} />
              <Text style={{ color: theme.subText, marginTop: 8 }}>Upload Food Image</Text>
            </>
          )}
        </TouchableOpacity>

        {renderInput('Food Name', formData.name, 'name')}
        {renderInput('Price ($)', formData.price, 'price', 'numeric')}
        
        <Text style={[styles.label, { color: theme.subText, marginTop: 15 }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[
                styles.chip, 
                { backgroundColor: theme.background },
                formData.category === cat && { backgroundColor: theme.primary }
              ]}
              onPress={() => setFormData({...formData, category: cat})}
            >
              <Text style={[styles.chipText, { color: formData.category === cat ? '#FFF' : theme.text }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: theme.subText, marginTop: 15 }]}>Food Type</Text>
        <View style={styles.row}>
          {types.map(t => (
            <TouchableOpacity 
              key={t} 
              style={[
                styles.typeBtn, 
                { backgroundColor: theme.background, borderColor: theme.border },
                formData.type === t && { borderColor: theme.primary, borderWidth: 2 }
              ]}
              onPress={() => setFormData({...formData, type: t})}
            >
              <Ionicons 
                name={t === 'Veg' ? 'leaf' : 'restaurant'} 
                size={18} 
                color={t === 'Veg' ? theme.success : theme.danger} 
              />
              <Text style={[styles.typeText, { color: theme.text, marginLeft: 8 }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderInput('Description', formData.description, 'description', 'default', true)}
        {renderInput('Preparation Time (min)', formData.prepTime, 'prepTime', 'numeric')}

        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.switchLabel, { color: theme.text }]}>Availability</Text>
            <Text style={{ color: theme.subText, fontSize: 12 }}>Currently in stock</Text>
          </View>
          <Switch 
            value={formData.isAvailable} 
            onValueChange={(v) => setFormData({...formData, isAvailable: v})}
            trackColor={{ false: "#767577", true: theme.success + '80' }}
            thumbColor={formData.isAvailable ? theme.success : "#f4f3f4"}
          />
        </View>

        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.switchLabel, { color: theme.text }]}>Popular Item</Text>
            <Text style={{ color: theme.subText, fontSize: 12 }}>Appear in trending</Text>
          </View>
          <Switch 
            value={formData.isPopular} 
            onValueChange={(v) => setFormData({...formData, isPopular: v})}
            trackColor={{ false: "#767577", true: theme.warning + '80' }}
            thumbColor={formData.isPopular ? theme.warning : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Add to Menu</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imageUpload: {
    height: 120,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeBtn: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeText: {
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitBtn: {
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AddFoodItem;
