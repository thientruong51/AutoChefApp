import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Footer from "../components/Footer";
import { API_BASE_URL } from "@env";

const HomeScreen = ({ navigation }) => {
  const [allMenu, setAllMenu] = useState([]); 
  const [menu, setMenu] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/Recipe/all?page=1&pageSize=10`)
      .then((response) => response.json())
      .then((data) => {
        if (data.recipes) {
          setAllMenu(data.recipes);
          setMenu(data.recipes); 
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setMenu(allMenu);
    } else {
      const filtered = allMenu.filter((item) =>
        item.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMenu(filtered);
    }
  }, [searchQuery, allMenu]);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate("Details", { recipeId: item.recipeId })}
    >
      <View style={styles.categoryImageWrapper}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.categoryImage, !item.isActive && styles.inactiveImage]}
        />
        {!item.isActive && (
          <View style={styles.ribbonContainerCategory}>
            <Text style={styles.ribbonTextCategory}>SOLD OUT</Text>
          </View>
        )}
      </View>
      <Text style={styles.categoryText}>{item.recipeName}</Text>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuCard}
      onPress={() => navigation.navigate("Details", { recipeId: item.recipeId })}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.menuCardImage, !item.isActive && styles.inactiveImage]}
        />
        {!item.isActive && (
          <View style={styles.ribbonContainerSmall}>
            <Text style={styles.ribbonTextSmall}>SOLD OUT</Text>
          </View>
        )}
      </View>
      <Text style={styles.menuCardTitle}>{item.recipeName}</Text>
      <Text style={styles.menuCardPrice}>Ingredients: {item.ingredients}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.header}>Menu</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        <FlatList
          data={menu}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.recipeId.toString()}
          renderItem={renderCategoryItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          style={{ marginBottom: 16 }}
        />

        <Text style={styles.sectionTitle}>Promotion</Text>
        <View style={styles.promotionContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.promotionText}>Today's Offer</Text>
            <Text style={styles.promotionSubText}>
              Free extra noodles on all orders above 100.000 VND
            </Text>
          </View>
          <View style={styles.promotionImageWrapper}>
            <Image source={require("../../assets/pho.png")} style={styles.promotionImage} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={menu}
            keyExtractor={(item) => item.recipeId.toString()}
            numColumns={2}
            key="2"
            scrollEnabled={false} 
            columnWrapperStyle={styles.cardRow}
            renderItem={renderPopularItem}
          />
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 16,
    color: "#4E973C",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  // Danh mục món ăn ngang
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    marginBottom: 16,
  },
  categoryImageWrapper: {
    position: "relative",
    width: 70,
    height: 70,
    marginBottom: 4,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    maxWidth: 70,
  },
  // Ribbon sold out cho category
  ribbonContainerCategory: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#D32F2F",
    paddingVertical: 2,
    paddingHorizontal: 6,
    transform: [{ rotate: "-45deg" }],
    borderRadius: 2,
  },
  ribbonTextCategory: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
  },
  // Promotion
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4E973C",
    marginTop: 10,
  },
  promotionContainer: {
    backgroundColor: "#DFFFD6",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    position: "relative",
  },
  promotionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  promotionSubText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  promotionImageWrapper: {
    position: "absolute",
    right: 0,
    bottom: 65,
  },
  promotionImage: {
    width: 120,
    height: 80,
    borderRadius: 40,
  },
  // Popular (2 cột)
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuCardImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E973C",
    textAlign: "center",
  },
  menuCardPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    textAlign: "center",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  // Ribbon sold out cho card
  ribbonContainerSmall: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#D32F2F",
    paddingVertical: 2,
    paddingHorizontal: 8,
    transform: [{ rotate: "-45deg" }],
    borderRadius: 4,
  },
  ribbonTextSmall: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Ảnh bị mờ nếu không hoạt động
  inactiveImage: {
    opacity: 0.3,
  },
});
