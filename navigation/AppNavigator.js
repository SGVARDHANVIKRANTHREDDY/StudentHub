import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Import screens (we'll create these next)
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

import MerchantHomeScreen from '../screens/MerchantHomeScreen';
import TuckshopScreen from '../screens/TuckshopScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Tuckshop"
        component={TuckshopScreen}
        options={{
          tabBarLabel: 'Tuckshop',
          // Add icon here when we have vector icons
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarLabel: 'Marketplace',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function MerchantTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Inventory"
        component={MerchantHomeScreen}
        options={{
          tabBarLabel: 'Inventory',
        }}
      />
      <Tab.Screen
        name="Orders"
        component={MerchantHomeScreen} // We'll create separate screens later
        options={{
          tabBarLabel: 'Orders',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  const { user, userProfile, userRole, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    );
  }

  // Default to student if role is not set
  const role = userRole || 'student';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'student' ? (
        <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      ) : (
        <Stack.Screen name="MerchantTabs" component={MerchantTabNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
