
        import React, { useState } from 'react';
        import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
        import { router } from 'expo-router';

        const SignupScreen = () => {
          const [name, setName] = useState('');
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');

          const handleSignup = async () => {
            try {
              const response = await fetch('http://192.168.29.122:5000/auth/signup', { // Correct URL
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
              });
              const data = await response.json();

              if (response.ok) {
                Alert.alert('Signup Successful', data.message);
                router.replace('LoginScreen');
              } else {
                Alert.alert('Signup Failed', data.message || 'An error occurred.');
              }
            } catch (error) {
              console.error('Signup error:', error);
              Alert.alert('Error', 'Could not connect to server.');
            }
          };

          return (
            <View style={styles.container}>
              <Text style={styles.title}>Signup</Text>
              <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
              <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
              <Button title="Signup" onPress={handleSignup} />
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
          },
        });

        export default SignupScreen;