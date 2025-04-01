// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.29.122:5000/auth/login', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Assuming your backend returns a token
                await AsyncStorage.setItem('userToken', data.token);
                router.replace('/(tabs)'); // Navigate to tabs
            } else {
                Alert.alert('Login Failed', data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Could not connect to server.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <View style={styles.inline}><TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>LOGIN</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button}  onPress={() => router.replace('SignupScreen')} ><Text style={styles.buttonText}>SIGNUP</Text></TouchableOpacity></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius:5
    },
    inline:{ 
        flexDirection:"row",
        gap:10   
    },
    button:{
        width:scale(151),
        backgroundColor:"#f60",
        alignItems:'center',
        borderRadius:5,
        borderWidth:.1,
        padding:10
    },
    buttonText:{
        fontWeight:700,
        color:"white"
    }
});

export default LoginScreen;