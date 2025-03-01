import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Footer from '../components/Footer';
const HomeScreen = ({ navigation }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://autochefsystem.azurewebsites.net/api/Recipe/all?page=1&pageSize=10')
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated Menu:", data.recipes);  // Debug dữ liệu
        if (data.recipes) {
          setMenu(data.recipes);
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Menu</Text>
      <TextInput style={styles.searchBar} placeholder="Search..." placeholderTextColor="#888" />

      {/* Danh mục món ăn */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/pho.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Pho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/nui.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Nui</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/banhcanh.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Banh Canh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/hutieu-removebg-preview.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Hu Tieu</Text>
        </TouchableOpacity>
      </View>

      {/* Khuyến mãi */}
      <Text style={styles.popularHeader}>Popular</Text>
      <View style={styles.promotionContainer}>
        <Text style={styles.promotionText}>Today's Offer</Text>
        <Text style={styles.promotionSubText}>Free extra noodles on all orders above 100.000 VND</Text>
      </View>

      {/* Danh sách món ăn từ API */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={menu}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem} onPress={() => navigation.navigate('Details', { recipeId: item.recipeId })}
            >

              <Image source={require('../../assets/pho.png')} style={styles.menuImage} />
              <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.recipeName}</Text>
                <Text style={styles.menuPrice}>{item.ingredients}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.recipeId.toString()}
        />
      )}
      <View>

        <Footer />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 40, color: '#4E973C' },
  searchBar: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },

  // Danh mục món ăn
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  categoryItem: { alignItems: 'center' },
  categoryImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 4 },
  categoryText: { fontSize: 14, fontWeight: 'bold', color: '#333' },

  // Khuyến mãi
  popularHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#4E973C' },
  promotionContainer: { backgroundColor: '#DFFFD6', padding: 16, borderRadius: 8, marginBottom: 16 },
  promotionText: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  promotionSubText: { fontSize: 14, color: '#333', marginTop: 4 },

  // Danh sách món ăn
  menuItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  menuImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  menuInfo: { flex: 1 },
  menuName: { fontSize: 16, fontWeight: 'bold' },
  menuPrice: { fontSize: 14, color: '#888', marginTop: 4 },
});

export default HomeScreen;
