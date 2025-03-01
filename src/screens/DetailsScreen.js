import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { CartContext } from "../context/CartContext";

const DetailsScreen = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const { addToCart } = useContext(CartContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://autochefsystem.azurewebsites.net/api/Recipe/${recipeId}`)
      .then(response => response.json())
      .then(data => {
        setRecipe(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("API Fetch Error:", error);
        setLoading(false);
      });
  }, [recipeId]);

  const handleAddToCart = () => {
    if (!recipe) {
      Alert.alert("Lỗi", "Không thể thêm món này vào giỏ hàng.");
      return;
    }

    addToCart(recipe);
    navigation.navigate("Cart");
  };

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" />;
  if (!recipe) return <Text style={styles.errorText}>Không tìm thấy dữ liệu</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: recipe.image || "https://via.placeholder.com/200" }} style={styles.foodImage} />
      <Text style={styles.foodTitle}>{recipe.recipeName}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  foodImage: { width: 200, height: 200, borderRadius: 100, alignSelf: "center" },
  foodTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  addToCartButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  addToCartText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },
});
