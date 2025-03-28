import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { API_BASE_URL } from "@env"; 


const DetailOrderScreen = () => {
  const route = useRoute();
  const { orderId } = route.params || {}; 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/Order/${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setLoading(false);
      });
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== "pending") {
      Alert.alert("Order cannot be canceled");
      return;
    }
  
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          style: "destructive", 
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/Order/update-order-status`, {
                method: "PUT",
                headers: {
                  "Accept": "*/*",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId, status: "Cancelled" }),
              });
  
              if (response.ok) {
                setOrder({ ...order, status: "Cancelled" });
  
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Order Canceled",
                    body: "Your order has been successfully canceled.",
                    sound: "default",
                  },
                  trigger: null,
                });
  
                Alert.alert(" Order Canceled", "Your order has been successfully canceled.");
              } else {
                Alert.alert(" Error", "Failed to cancel the order. Please try again.");
              }
            } catch (error) {
              console.error("Error updating order status:", error);
              Alert.alert(" Connection Error", "Unable to connect to the server. Please try again.");
            }
          }
        }
      ]
    );
  };
  

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!orderId || !order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No orders.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Details</Text>
      <Text style={styles.label}>Order ID: {order.orderId}</Text>
      <Text style={styles.label}>Dish Name: {order.recipeName}</Text>
      <Text style={styles.label}>Status: {order.status}</Text>
      <Text style={styles.label}>Ordered Time: {new Date(order.orderedTime).toLocaleString()}</Text>
      <Text style={styles.label}>Completed Time: {order.completedTime ? new Date(order.completedTime).toLocaleString() : ""}</Text>

      {order.status === "pending" && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
          <Text style={styles.cancelText}>Cancel Order</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red", fontWeight: "bold" },
  header: { fontSize: 22, fontWeight: "bold", color: "#388E3C", marginBottom: 10 },
  label: { fontSize: 18, marginVertical: 5 },
  cancelButton: { backgroundColor: "#E53935", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  cancelText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default DetailOrderScreen;
