import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData = JSON.parse(authDataSerialized);
        setUser(_authData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (email, password) => {
    try {
      const result = await api.login(email, password);
      // result should contain { token, user: { id, name, email, role } }
      setUser(result.user);
      await AsyncStorage.setItem('@AuthData', JSON.stringify(result.user));
      await AsyncStorage.setItem('@AuthToken', result.token);
      return { success: true, role: result.user.role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const result = await api.signup(userData);
      setUser(result.user);
      await AsyncStorage.setItem('@AuthData', JSON.stringify(result.user));
      await AsyncStorage.setItem('@AuthToken', result.token);
      return { success: true, role: result.user.role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@AuthData');
    await AsyncStorage.removeItem('@AuthToken');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
