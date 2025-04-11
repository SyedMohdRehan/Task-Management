// app/(tabs)/index.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token:', token)
      const response = await fetch('https://task-management-backendd-wth8.onrender.com/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response Headers:', response.headers); // Log headers
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        console.log('Failed to fetch tasks:', data);
      }
    } catch (error) {
      console.alert('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const renderItem = ({ item }) => (<View style={styles.tasks}>
    <Button title={item.title} onPress={() => router.push(`../TaskDetailsScreen?taskId=${item._id}`)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  tasks.forEach((task) => {
    console.log("Task _id:", task._id);
});

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item?._id?.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },task:{
    gap:10,
    flexDirection:"column"
  }
});

export default HomeScreen;