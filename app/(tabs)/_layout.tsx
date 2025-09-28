import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: '#08313B' },
      headerTintColor: '#fff',
      tabBarActiveTintColor: '#08313B',
      tabBarInactiveTintColor: '#7aa0ac',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Communities',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        // FIXED: Correct name for the notifications file
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="bell" color={color} />,
        }}
      />
    </Tabs>
  );
}