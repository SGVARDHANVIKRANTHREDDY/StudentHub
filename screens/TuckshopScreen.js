import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Card from '../components/Card';
import Button from '../components/Button';

export default function TuckshopScreen() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching tuckshop items...');
      const itemsCollection = collection(db, 'tuckshopItems');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched items:', itemsList.length);
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load tuckshop items. Check your internet connection.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const generatePickupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const placeOrder = async (paymentMethod) => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    setPlacingOrder(true);
    try {
      const pickupCode = generatePickupCode();
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        paymentMethod,
        pickupCode,
        status: 'preparing',
        createdAt: new Date(),
      });

      Alert.alert(
        'Order Placed!',
        `Your pickup code is: ${pickupCode}\nTotal: ₹${totalAmount}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setCart([]);
              setShowCart(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setPlacingOrder(false);
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
          title="Add to Cart"
          onPress={() => addToCart(item)}
          size="small"
        />
      </View>
    </Card>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>₹{item.price} x {item.quantity}</Text>
        <Text style={styles.cartItemTotal}>₹{item.price * item.quantity}</Text>
      </View>
      <View style={styles.cartItemControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading tuckshop items...</Text>
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tuckshop</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.noItemsText}>No items available yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tuckshop</Text>
        {cart.length > 0 && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setShowCart(true)}
          >
            <Text style={styles.cartButtonText}>
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Cart</Text>
            <TouchableOpacity onPress={() => setShowCart(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cartList}
              />

              <View style={styles.cartSummary}>
                <Text style={styles.totalText}>Total: ₹{cartTotal}</Text>
                <View style={styles.paymentButtons}>
                  <Button
                    title="Pay Online"
                    onPress={() => placeOrder('online')}
                    loading={placingOrder}
                    style={styles.paymentButton}
                  />
                  <Button
                    title="Pay at Counter"
                    variant="secondary"
                    onPress={() => placeOrder('counter')}
                    loading={placingOrder}
                    style={styles.paymentButton}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  cartSummary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  paymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
