import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { CartContext } from "../context/CartContext";
import * as Notifications from "expo-notifications"; 

const CartScreen = () => {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);
  const [orderInstruction, setOrderInstruction] = useState(""); // Lưu trữ hướng dẫn đơn hàng

  const handleRemoveItem = (recipeId) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa món này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => removeFromCart(recipeId),
        style: "destructive",
      },
    ]);
  };

  // Hàm xử lý khi bấm Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm món ăn trước khi thanh toán.");
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
            title: "✅ Đặt hàng thành công!",
            body: "Đơn hàng của bạn đang được xử lý.",
            sound: "default",
          },
          trigger: null, // Gửi ngay lập tức
        });
  
        Alert.alert("🎉 Đặt hàng thành công!", "Đơn hàng của bạn đã được gửi.");
      } else {
        Alert.alert("⚠️ Lỗi đặt hàng", result.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      Alert.alert("❌ Lỗi kết nối", "Không thể kết nối đến máy chủ, vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{cartItems.length} món trong giỏ hàng</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.recipeId.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image || "https://via.placeholder.com/70" }} style={styles.image} />
            <Text style={styles.itemName}>{item.recipeName}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.recipeId)}>
              <Icon name="times-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Input Order Instruction */}
      <Text style={styles.label}>Order Instruction</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập hướng dẫn đơn hàng..."
        value={orderInstruction}
        onChangeText={setOrderInstruction}
      />

      {/* Nút Checkout */}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}  // Vô hiệu hóa nếu giỏ hàng trống
      >
        <Text style={styles.checkoutText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 22, fontWeight: "bold", color: "#388E3C", marginBottom: 10 },
  cartItem: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10 },
  image: { width: 70, height: 70, borderRadius: 10 },
  itemName: { fontSize: 16, fontWeight: "bold", flex: 1 },
  label: { fontSize: 16, marginTop: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginVertical: 10 },
  checkoutButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center" },
  checkoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});
