import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { CartContext } from "../context/CartContext";
import * as Notifications from "expo-notifications";
import Footer from "../components/Footer";

const CartScreen = () => {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);
  const [orderInstruction, setOrderInstruction] = useState(""); // Lưu trữ hướng dẫn đơn hàng
  const [quantity, setQuantity] = useState(1);
  const handleRemoveItem = (recipeId) => {
    Alert.alert("Confirm", "Are you sure you to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => removeFromCart(recipeId),
        style: "destructive",
      },
    ]);
  };

  // Hàm xử lý khi bấm Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Please add dishes before payment.");
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

      const response = await fetch("https://autochefsystem.azurewebsites.net/api/Order/create", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        setCartItems([]);

        // ✅ Gửi thông báo đẩy sau khi đặt hàng thành công
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Order successful!",
            body: "Your order is being processed.",
            sound: "default",
          },
          trigger: null, // Gửi ngay lập tức
        });

        Alert.alert("🎉 Order successful!", "Your order is being processed.");
      } else {
        Alert.alert("⚠️ Order error", result.message || "An error occurred, please try again.");
      }
    } catch (error) {
      console.error("Error when ordering:", error);
      Alert.alert("❌ Connection error", "Unable to connect to the server, please try again.");
    }
  };
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{cartItems.length} items in the cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.recipeId.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.cartItem}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.recipeId)}
                style={styles.deleteButton}
              >
                <Icon name="times-circle" size={24} color="red" />
              </TouchableOpacity>

              <Image source={{ uri: item.imageUrl }} style={styles.image} />

              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.recipeName}</Text>

                <View style={styles.quantityControl}>
                  <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyButton}>
                    <Icon name="minus" size={16} color="#4BB842" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <TouchableOpacity onPress={increaseQuantity} style={styles.qtyButton}>
                    <Icon name="plus" size={16} color="#4BB842" />
                  </TouchableOpacity>
                </View>
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



      {/* Nút Checkout */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.checkoutText}>Place Order</Text>
      </TouchableOpacity>
      <View>

        <Footer />
      </View>
    </View>
    
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 22, fontWeight: "bold", color: "#388E3C", marginBottom: 10 },
  cartItem: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, alignItems: "center", }, 
  image: { width: 150, height: 120 },
  itemContent: {flex: 1, marginLeft: 10, justifyContent: "space-between",},
  itemName: { fontSize: 22, fontWeight: "bold", marginLeft: 10, color: "#4BB842" },
  label: { fontSize: 18, marginTop: 10,  },
  input: { fontSize: 16, backgroundColor: "#fff", padding: 10, borderRadius: 30, marginVertical: 10, height:100, borderWidth: 1  },
  checkoutButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 30, alignItems: "center", },
  checkoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  quantityControl: { flexDirection: "row", alignItems: "center", marginTop: 70, marginLeft:10 },
  qtyButton: { backgroundColor: "#fff", padding: 5, borderRadius: 15, borderWidth: 3, borderColor: "#4BB842" },
  quantity: { fontSize: 18, fontWeight: "bold", marginHorizontal: 10 },
  deleteButton: {
    position: "absolute", top: 5, right: 5, zIndex: 1,
  },
});
