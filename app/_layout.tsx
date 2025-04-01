// app/_layout.js
import React from 'react';
import { Stack } from 'expo-router/stack';
import InitalRoute from './InitalRoute';

export default function RootLayout() {
    return (
        <><InitalRoute />
            
            <Stack
                screenOptions={{
                  headerShown: false, // This hides the header for all tabs
                }}
            >
                <Stack.Screen name="LoginScreen" />
                <Stack.Screen name="SignupScreen" />
            </Stack>
        </>
    );
}