import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { API_BASE_URL } from "@env";
import Footer from "../components/Footer";

const MyOrderScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "Pending" },
    { key: "Processing", title: "Processing" },
    { key: "Completed", title: "Completed" },
    { key: "Cancelled", title: "Cancelled" },
  ]);

  const previousOrdersRef = useRef([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Order/all?sort=true&page=1&pageSize=10`);
      const data = await response.json();
      const newOrders = data.orders || [];

      if (previousOrdersRef.current.length > 0) {
        newOrders.forEach((order) => {
          const prevOrder = previousOrdersRef.current.find((o) => o.orderId === order.orderId);
          if (prevOrder && prevOrder.status !== order.status) {
            if (["Processing", "Completed", "Cancelled"].includes(order.status)) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Order update",
                  body: `Order ${order.orderId} is now ${order.status}`,
                  sound: "default",
                },
                trigger: null,
              });
            }
          }
          if (!prevOrder && ["Processing", "Completed", "Cancelled"].includes(order.status)) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "New Order update",
                body: `Order ${order.orderId} is now ${order.status}`,
                sound: "default",
              },
              trigger: null,
            });
          }
        });
      }

      previousOrdersRef.current = newOrders;
      setOrders(newOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("DetailOrder", { orderId: item.orderId })}
    >
      <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
      <Text style={styles.orderDetails}>Dish Name: {item.recipeName}</Text>
      <Text style={styles.orderDetails}>
        Ordered: {new Date(item.orderedTime).toLocaleString()} </Text>
      <Text style={styles.orderDetails}>Completed Time: {item.completedTime ? new Date(item.completedTime).toLocaleString() : ""}</Text>
      
    </TouchableOpacity>
  );

  const renderScene = ({ route }) => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#388E3C" />
        </View>
      );
    }

    const filteredOrders = orders.filter((order) => order.status === route.key);

    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={renderOrderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {route.title} orders.</Text>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled={false}
            style={styles.tabBar}
            tabStyle={{
              width: (layout.width - 7) / routes.length, 
              paddingHorizontal: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
            indicatorStyle={styles.indicator}
            renderLabel={({ route, color }) => (
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.tabLabel, { color }]}
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4E973C",
    textAlign: "center",
    marginVertical: 15,
    marginTop:40
  },
  tabBar: {
    backgroundColor: "#4BB842",
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    elevation: 3,
  },
  tabLabel: {
    fontWeight: "bold",
    fontSize: 9, 
    textAlign: "center",
    textTransform: "none",
    includeFontPadding: false,
  },
  indicator: {
    backgroundColor: "#2E7D32",
    height: 3,
    borderRadius: 2,
    marginHorizontal: 7,
  },
  orderItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  orderDetails: {
    fontSize: 16,
    color: "#4CAF50",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
});

export default MyOrderScreen;
