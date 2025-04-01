import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

const AuthContext = createContext({
  userToken: null,
  setUserToken: (token: string | null) => {},
  isLoading: true,
  isLoggedIn: false,
});

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const storedToken = await AsyncStorage.getItem('userToken');
        setUserToken(storedToken);
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (userToken) {
        router.replace('/(tabs)');
      } else {
        router.replace('/LoginScreen');
      }
      SplashScreen.hideAsync();
    }
  }, [isLoading, userToken, router]);

  const contextValue = {
    userToken,
    setUserToken: async (token: string | null) => {
      if (token) {
        await AsyncStorage.setItem('userToken', token);
      } else {
        await AsyncStorage.removeItem('userToken');
      }
      setUserToken(token);
    },
    isLoading,
    isLoggedIn: !!userToken,
  };

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);