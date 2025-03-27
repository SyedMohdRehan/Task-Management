// app/(tabs)/TaskDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

const TaskDetailsScreen = () => {
  const { taskId } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log(taskId)

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`http://192.168.29.122:5000/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTask(data);
          setEditedTitle(data.title);
          setEditedDescription(data.description);
        } else {
          console.error('Failed to fetch task details:', data);
          Alert.alert('Error', 'Failed to fetch task details');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        Alert.alert('Error', 'Could not connect to server');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [taskId]);

  const handleEditTask = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://192.168.29.122:5000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedTitle, description: editedDescription }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Task Updated', data.message);
        setTask({ ...task, title: editedTitle, description: editedDescription });
        setEditMode(false);
      } else {
        Alert.alert('Failed to update task', data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const handleDeleteTask = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://192.168.29.122:5000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Task Deleted', 'Task deleted successfully.');
        router.replace('/(tabs)');
      } else {
        const data = await response.json();
        Alert.alert('Failed to delete task', data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/LoginScreen');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {editMode ? (
        <>
          <TextInput style={styles.input} value={editedTitle} onChangeText={setEditedTitle} />
          <TextInput style={styles.input} value={editedDescription} onChangeText={setEditedDescription} />
          <Button title="Save" onPress={handleEditTask} />
          <Button title="Cancel" onPress={() => setEditMode(false)} />
        </>
      ) : (
        <>
          <Text style={styles.title}>{task.title}</Text>
          <Text>{task.description}</Text>
          <Button title="Edit" onPress={() => setEditMode(true)} />
          <Button title="Delete" onPress={handleDeleteTask} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default TaskDetailsScreen;