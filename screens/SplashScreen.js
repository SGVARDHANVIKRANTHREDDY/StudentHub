import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingText('Connecting to Firebase...'), 1000);
    const timer2 = setTimeout(() => setLoadingText('Loading your profile...'), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudentHub</Text>
      <Text style={styles.subtitle}>Your Campus Marketplace</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      <Text style={styles.loadingText}>{loadingText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
  },
});
