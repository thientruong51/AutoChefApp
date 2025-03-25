import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { CartContext } from "../context/CartContext";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";
import { API_BASE_URL } from "@env"; 

const CartScreen = () => {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);
  const [orderInstruction, setOrderInstruction] = useState("");
  const navigation = useNavigation();

  const handleRemoveItem = (recipeId) => {
    Alert.alert("Confirm", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => removeFromCart(recipeId),
        style: "destructive",
      },
    ]);
  };

 
  
  
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Please add dishes.");
      return;
    }
  
    try {
      const orderData = {
        recipeId: cartItems[0].recipeId,
        locationId: 1,
        robotId: 1,
        orderedTime: new Date().toISOString(),
        status: "pending",
        instruction: orderInstruction,
      };
  
  
      const response = await fetch(`${API_BASE_URL}/Order/create-and-send-to-queue`, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
  
      if (response.ok) {
        setCartItems([]); 
  
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Order successful!",
            body: "Your order is being processed.",
            sound: "default",
          },
          trigger: null,
        });
  
        
          navigation.replace("MyOrders");
       
      } else {
        const result = await response.json();
        Alert.alert("⚠️ Order error", result.message || "An error occurred, please try again.");
      }
    } catch (error) {
      Alert.alert("❌ Connection error", "Unable to connect to the server, please try again.");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{cartItems.length} items in the cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.recipeId.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.cartItem}>
              <TouchableOpacity onPress={() => handleRemoveItem(item.recipeId)} style={styles.deleteButton}>
                <Icon name="times-circle" size={24} color="red" />
              </TouchableOpacity>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.recipeName}</Text>
              </View>
            </View>
            <Text style={styles.label}>Note to Restaurant</Text>
            <TextInput
              style={styles.input}
              placeholder="Add your request..."
              value={orderInstruction}
              onChangeText={setOrderInstruction}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={cartItems.length === 0}>
        <Text style={styles.checkoutText}>Place Order</Text>
      </TouchableOpacity>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 22, fontWeight: "bold", color: "#388E3C", marginBottom: 10 },
  cartItem: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  image: { width: 150, height: 120 },
  itemContent: { flex: 1, marginLeft: 10, justifyContent: "space-between" },
  itemName: { fontSize: 22, fontWeight: "bold", marginLeft: 10, color: "#4BB842" },
  label: { fontSize: 18, marginTop: 10 },
  input: { fontSize: 16, backgroundColor: "#fff", padding: 10, borderRadius: 30, marginVertical: 10, height: 100, borderWidth: 1 },
  checkoutButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 30, alignItems: "center" },
  checkoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  deleteButton: { position: "absolute", top: 5, right: 5, zIndex: 1 },
});

export default CartScreen;
