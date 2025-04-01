// app/(tabs)/_layout.js
import React from 'react';
import { Tabs ,useRouter }  from 'expo-router';
import { Button, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabsLayout() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/LoginScreen'); // Navigate to login screen
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };
  return (
    <Tabs >
      <Tabs.Screen name="index" options={{ title: 'Home', headerRight: () => (
            <Button title="Sign Out" onPress={handleSignOut} />
          ),}}/>
      <Tabs.Screen name="AddTaskScreen" options={{ title: 'Add Task' }} />
     
    </Tabs>
  );
}