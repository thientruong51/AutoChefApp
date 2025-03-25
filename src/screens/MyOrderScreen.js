import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
    { key: "progressing", title: "Progressing" },
    { key: "completed", title: "Completed" },
    { key: "cancelled", title: "Cancelled" },
  ]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders(); 
    }, [])
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Order/all?sort=true&page=1&pageSize=10`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("DetailOrder", { orderId: item.orderId })}
    >
      <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
      <Text style={styles.orderDetails}>Recipe ID: {item.recipeId}</Text>
      <Text style={styles.orderDetails}>Ordered: {new Date(item.orderedTime).toLocaleString()}</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No {route.title} orders.</Text>}
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
      indicatorStyle={{ backgroundColor: "#2E7D32", height: 3 }}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      tabStyle={{ width: layout.width / routes.length }} 
      scrollEnabled={false} 
    />
  )}
/>



      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" }, 
  header: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#2E7D32", 
    textAlign: "center", 
    marginVertical: 15 
  },
  tabBar: { 
    backgroundColor: "#A5D6A7", 
    borderRadius: 10, 
    marginHorizontal: 10, 
    marginBottom: 5, 
    elevation: 3,
  },
  tabLabel: { 
    color: "#1B5E20", 
    fontWeight: "bold", 
    fontSize: 13,
    textAlign: "center", 
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
    elevation: 3 
  },
  orderId: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#1B5E20" 
  },
  orderDetails: { 
    fontSize: 16, 
    color: "#4CAF50" 
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  emptyText: { 
    textAlign: "center", 
    marginTop: 20, 
    fontSize: 18, 
    color: "gray" 
  },
});

export default MyOrderScreen;
