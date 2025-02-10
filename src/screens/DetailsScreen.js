import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const DetailsScreen = ({ route, navigation, addToCart }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <View style={styles.container}>
      {/* Hình ảnh món ăn */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.foodImage} />
      </View>

      {/* Nội dung chi tiết */}
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <View style={styles.rating}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}> 4.5</Text>
          </View>
          <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
        </View>

        <Text style={styles.foodTitle}>{item.name}</Text>
        <Text style={styles.foodDescription}>
          Typical traditional Pho in Vietnam is also combined with rare beef from America.
        </Text>

        {/* Chỉnh số lượng */}
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyButton}>
            <Icon name="minus" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.qtyButton}>
            <Icon name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Thêm Add-ons */}
        <Text style={styles.addOnsTitle}>Add Ons</Text>
        <View style={styles.addOnsContainer}>
          <TouchableOpacity style={styles.addOnItem}>
            <Image source={require("../../assets/bonam.png")} style={styles.addOnImage} />
            <Text style={styles.addOnText}>Beef Encrusted</Text>
            <Icon name="plus-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addOnItem}>
            <Image source={require("../../assets/ganbo.png")} style={styles.addOnImage} />
            <Text style={styles.addOnText}>Beef Tendon</Text>
            <Icon name="plus-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addOnItem}>
            <Image source={require("../../assets/gia.png")} style={styles.addOnImage} />
            <Text style={styles.addOnText}>Bean Sprouts</Text>
            <Icon name="plus-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        
      </View>
      
      <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            addToCart({ ...item, quantity });
            navigation.navigate("Cart");
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" },
  imageContainer: { alignItems: "center", marginTop: 20 },
  foodImage: { width: 200, height: 200, borderRadius: 100 },
  detailsContainer: { 
    backgroundColor: "#fff", 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    marginTop: -20 
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rating: { flexDirection: "row", alignItems: "center", backgroundColor: "#DFF6E3", padding: 5, borderRadius: 10 },
  ratingText: { fontSize: 14, fontWeight: "bold", color: "#2E7D32" },
  price: { fontSize: 18, fontWeight: "bold", color: "#FFC107" },
  foodTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 5 },
  foodDescription: { fontSize: 14, color: "#666", marginBottom: 10 },
  quantityControl: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 },
  qtyButton: { backgroundColor: "#4CAF50", padding: 8, borderRadius: 5 },
  quantity: { fontSize: 18, fontWeight: "bold", marginHorizontal: 10 },
  addOnsTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  addOnsContainer: { flexDirection: "row", justifyContent: "space-around" },
  addOnItem: { alignItems: "center" },
  addOnImage: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  addOnText: { fontSize: 12, fontWeight: "bold" },
  addToCartButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  addToCartText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});