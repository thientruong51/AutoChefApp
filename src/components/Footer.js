import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getIconColor = (screen) => (route.name === screen ? "#4CAF50" : "#8C8C8C");

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Home")}>
        <Icon name="home" size={24} color={getIconColor("Home")} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Cart")}>
        <Icon name="shopping-cart" size={22} color={getIconColor("Cart")} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("MyOrders")}>
        <Icon name="receipt" size={24} color={getIconColor("MyOrders")} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    padding: 10,
  },
});

export default Footer;
