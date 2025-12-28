import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MarketplaceScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchItems();
    }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching marketplace items...');
      const itemsCollection = collection(db, 'marketplaceItems');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched marketplace items:', itemsList.length);
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      Alert.alert('Error', 'Failed to load marketplace items. Check your internet connection.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = async (item) => {
    try {
      await addDoc(collection(db, 'marketplaceOrders'), {
        userId: user.uid,
        userEmail: user.email,
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        sellerId: item.sellerId,
        status: 'pending',
        createdAt: new Date(),
      });
      Alert.alert('Success', `Purchase request sent for ${item.name}`);
    } catch (error) {
      console.error('Error buying item:', error);
      Alert.alert('Error', 'Failed to send purchase request');
    }
  };

  const renderItem = ({ item }) => (
    <Card>
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <Button
          title="Buy Now"
          onPress={() => buyItem(item)}
          size="small"
        />
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading marketplace items...</Text>
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.center}>
          <Text style={styles.noItemsText}>No items available yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
