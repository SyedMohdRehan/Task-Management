// app/(tabs)/_layout.js
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="AddTaskScreen" options={{ title: 'Add Task' }} />
      <Tabs.Screen name="TaskDetailsScreen" options={{ title: 'Task Details' }} />
    </Tabs>
  );
}