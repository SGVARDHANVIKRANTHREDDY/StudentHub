import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function MerchantHomeScreen() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching merchant items...');
      const itemsCollection = collection(db, 'tuckshopItems');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(item => item.merchantId === user.uid);
      console.log('Fetched merchant items:', itemsList.length);
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load your items');
      setItems([]);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching merchant orders...');
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(order => order.status === 'pending' || order.status === 'preparing');
      console.log('Fetched merchant orders:', ordersList.length);
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'tuckshopItems'), {
        ...newItem,
        price: parseFloat(newItem.price),
        merchantId: user.uid,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Item added successfully');
      setNewItem({ name: '', description: '', price: '', category: '' });
      setShowAddForm(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      Alert.alert('Success', `Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Error', 'Failed to update order');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await deleteDoc(doc(db, 'tuckshopItems', item.id));
                    fetchItems();
                  } catch (error) {
                    Alert.alert('Error', 'Failed to delete item');
                  }
                },
              },
            ]
          );
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order #{item.id.slice(-6)}</Text>
      <Text style={styles.orderCustomer}>{item.userEmail}</Text>
      <Text style={styles.orderItems}>
        {item.items.map(orderItem => `${orderItem.name} x${orderItem.quantity}`).join(', ')}
      </Text>
      <Text style={styles.orderTotal}>Total: ₹{item.totalAmount}</Text>
      <Text style={styles.pickupCode}>Pickup Code: {item.pickupCode}</Text>
      <View style={styles.orderActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.readyButton]}
          onPress={() => updateOrderStatus(item.id, 'ready')}
        >
          <Text style={styles.actionButtonText}>Mark Ready</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => updateOrderStatus(item.id, 'completed')}
        >
          <Text style={styles.actionButtonText}>Mark Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Merchant Dashboard</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, !showAddForm && styles.activeTab]}
          onPress={() => setShowAddForm(false)}
        >
          <Text style={[styles.tabText, !showAddForm && styles.activeTabText]}>
            Inventory ({items.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, showAddForm && styles.activeTab]}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={[styles.tabText, showAddForm && styles.activeTabText]}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newItem.description}
            onChangeText={(text) => setNewItem({ ...newItem, description: text })}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={newItem.price}
            onChangeText={(text) => setNewItem({ ...newItem, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Category (e.g., Snacks, Stationery)"
            value={newItem.category}
            onChangeText={(text) => setNewItem({ ...newItem, category: text })}
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Your Items</Text>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />

          <Text style={styles.sectionTitle}>Pending Orders ({orders.length})</Text>
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
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
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 4,
  },
  pickupCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  readyButton: {
    backgroundColor: '#ffc107',
  },
  completeButton: {
    backgroundColor: '#28a745',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
