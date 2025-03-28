import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { API_BASE_URL } from "@env";

const DetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { recipeId } = route.params;
  const { cartItems, addToCart } = useContext(CartContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/Recipe/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Fetch Error:", error);
        setLoading(false);
      });
  }, [recipeId]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = () => {
    if (!recipe) {
      Alert.alert("Error", "This item cannot be added to the cart.");
      return;
    }
    if (!recipe.isActive) {
      Alert.alert("Sold Out", "This item is sold out and cannot be added to the cart.");
      return;
    }
    if (cartItems.length >= 1) {
      Alert.alert("Notice", "Cart can only contain one item at a time.");
      return;
    }
    addToCart({ ...recipe, quantity });
    navigation.navigate("Cart");
  };

  if (loading)
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1 }} />;
  if (!recipe) return <Text style={styles.errorText}>No data found</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={23} color="lightgrey" />
      </TouchableOpacity>

      <View style={styles.containerview}>
        <ScrollView>
          <View style={styles.imageContainer}>
            <LinearGradient
              colors={["#4DA445", "#45A13D"]}
              style={styles.gradientBackground}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: recipe.imageUrl }}
                  style={[styles.foodImage, !recipe.isActive && styles.inactiveImage]}
                />
                {!recipe.isActive && (
                  <View style={styles.ribbonContainer}>
                    <Text style={styles.ribbonText}>SOLD OUT</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.header}>
              <View style={styles.rating}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}> 4.5</Text>
              </View>
            </View>
            <View style={styles.header}>
              <Text style={styles.foodTitle}>{recipe.recipeName}</Text>
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
            <Text style={styles.foodDescription}>
              {recipe.description || "No description available."}
            </Text>
            <Text style={styles.addOnsTitle}>Add Ons</Text>
            <View style={styles.addOnsContainer}>
              <TouchableOpacity style={styles.addOnItem}>
                <Image source={require("../../assets/toi.png")} style={styles.addOnImage} />
                <Text style={styles.addOnText}>Pickled garlic</Text>
                <Icon name="plus-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addOnItem}>
                <Image source={require("../../assets/chanh.png")} style={styles.addOnImage} />
                <Text style={styles.addOnText}>Lemon</Text>
                <Icon name="plus-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addOnItem}>
                <Image source={require("../../assets/gia.png")} style={styles.addOnImage} />
                <Text style={styles.addOnText}>Bean Sprouts</Text>
                <Icon name="plus-circle" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <View>
        <TouchableOpacity
          style={[styles.addToCartButton, !recipe.isActive && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={!recipe.isActive}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  containerview: {
    backgroundColor: "#4DA445",
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#4DA445",
    height: 300,
  },
  gradientBackground: {
    width: 320, // hoặc tùy chỉnh theo ý bạn
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  foodImage: {
    width: 280,
    height: 220,
    borderRadius: 10,
  },
  inactiveImage: {
    opacity: 0.7,
  },
  ribbonContainer: {
    position: "absolute",
    top: 50,
    right: -45,
    backgroundColor: "#D32F2F",
    paddingVertical: 5,
    paddingHorizontal: 20,
    transform: [{ rotate: "45deg" }],
    borderRadius: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  ribbonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    padding: 20,
    marginTop: -20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4BB842",
    padding: 8,
    borderRadius: 20,
    width: 65,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  foodTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "left",
    color: "#4E973C",
  },
  foodDescription: {
    fontSize: 14,
    color: "#2D6D26",
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  qtyButton: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#4BB842",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  addOnsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "left",
    color: "#4E973C",
  },
  addOnsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  addOnItem: {
    alignItems: "center",
  },
  addOnImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  addOnText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 20,
    margin: 20,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});
