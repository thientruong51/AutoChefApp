import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
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
          Accept: "*/*",
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
        Alert.alert(
          "⚠️ Order error",
          result.message || "An error occurred, please try again."
        );
      }
    } catch (error) {
      Alert.alert("❌ Connection error", "Unable to connect to the server, please try again.");
    }
  };

  const renderCartItem = ({ item }) => (
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
      </View>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.cartCountText}>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in cart
        </Text>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.recipeId.toString()}
          renderItem={renderCartItem}
          scrollEnabled={false} 
        />

        {cartItems.length > 0 && (
          <>
            <Text style={styles.label}>Order Instruction</Text>
            <TextInput
              style={styles.input}
              placeholder="Add your request..."
              value={orderInstruction}
              onChangeText={setOrderInstruction}
            />
          </>
        )}


      </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[styles.checkoutButton, cartItems.length === 0 && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backMenuButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.backMenuText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop:40
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160, 
  },

  cartCountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4E973C",
    marginBottom: 16,
  },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  image: {
    width: 90,
    height: 70,
    borderRadius: 10,
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4BB842",
  },

  // Order instruction
  label: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    fontSize: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
  },



  bottomButtonsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 90,    
    alignItems: "center",
  },

  checkoutButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  backMenuButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  backMenuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E973C",
  },
});
