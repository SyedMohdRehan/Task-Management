// InitalRoute.js
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function InitalRoute() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    router.replace('/(tabs)'); // Navigate to tabs
                } else {
                    router.replace('/LoginScreen'); // Navigate to LoginScreen
                }
            } catch (error) {
                console.error('Error checking token:', error);
                router.replace('/LoginScreen'); // Default to LoginScreen if error
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    if (loading) {
        return <View />; // Or a loading indicator
    }

    return null; // Return null because we're just handling navigation
}