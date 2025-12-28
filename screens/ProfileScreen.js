import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

export default function ProfileScreen() {
  const { user, userProfile, userRole, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <Card>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>
            {userRole === 'student' ? 'Student' : 'Merchant'}
          </Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{user?.uid}</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {userRole === 'student' ? 'Student Features' : 'Merchant Features'}
          </Text>
          {userRole === 'student' ? (
            <View style={styles.featuresList}>
              <Text style={styles.feature}>• Browse tuckshop items</Text>
              <Text style={styles.feature}>• Place orders with pickup codes</Text>
              <Text style={styles.feature}>• Buy/sell in marketplace</Text>
              <Text style={styles.feature}>• Contact sellers privately</Text>
            </View>
          ) : (
            <View style={styles.featuresList}>
              <Text style={styles.feature}>• Manage tuckshop inventory</Text>
              <Text style={styles.feature}>• Process orders</Text>
              <Text style={styles.feature}>• Update order status</Text>
              <Text style={styles.feature}>• Generate pickup codes</Text>
            </View>
          )}
        </View>
      </Card>

      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.featuresList}>
            <Text style={styles.feature}>• Campus-only access</Text>
            <Text style={styles.feature}>• Email verification required</Text>
            <Text style={styles.feature}>• Private messaging</Text>
            <Text style={styles.feature}>• No phone numbers shared</Text>
          </View>
        </View>
      </Card>

      <View style={styles.logoutContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>StudentHub v1.0</Text>
        <Text style={styles.footerSubtext}>Your Campus Marketplace</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  profileInfo: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  featuresList: {
    marginLeft: 8,
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  logoutContainer: {
    padding: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
