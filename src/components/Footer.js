import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.footerContainer}>
     
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Home")}>
        <Icon name="home" size={24} color="#4CAF50" />
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("#")}>
        <Icon name="search" size={22} color="#8C8C8C" />
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Cart")}>
        <Icon name="shopping-cart" size={22} color="#8C8C8C" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Profile")}>
        <Icon name="user-circle" size={24} color="#8C8C8C" />
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
