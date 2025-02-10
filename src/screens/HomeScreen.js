import React from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Footer from '../components/Footer';
const HomeScreen = ({ navigation }) => {
  const menu = [
    { id: '1', name: 'Rare Beef Pho', price: 60000, image: require('../../assets/pho.png') },
    { id: '2', name: 'Hu Tieu Nam Vang', price: 50000, image: require('../../assets/hutieu-removebg-preview.png') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        placeholderTextColor="#888"
      />

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
      <Text style={styles.popularHeader}>Popular</Text>
      <View style={styles.promotionContainer}>
        
        <Text style={styles.promotionText}>Today's Offer</Text>
        <Text style={styles.promotionSubText}>Free extra noodles on all orders above 100.000 VND</Text>
      </View>

      <Text style={styles.popularHeader}>Popular</Text>

      <FlatList
        data={menu}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Details', { item })}>
            <Image source={item.image} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price.toLocaleString()} VND</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
      />
      <View>
      
      <Footer />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop:40,color:'#4E973C' },
  searchBar: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  categoryItem: { alignItems: 'center' },
  categoryImage: { width: 50, height: 50, borderRadius: 25, marginBottom: 8 },
  categoryText: { fontSize: 14, color: '#333' },
  promotionContainer: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 16, marginBottom: 16 },
  promotionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  promotionSubText: { color: '#fff', fontSize: 14, marginTop: 8 },
  popularHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color:'#4E973C' },
  menuList: { paddingBottom: 100 },
  menuItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  menuImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  menuInfo: { flex: 1 },
  menuName: { fontSize: 16, fontWeight: 'bold' },
  menuPrice: { fontSize: 14, color: '#888', marginTop: 4,color:'#D9C61C' },
  addButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 16, position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderColor: '#ddd' },
  navIcon: { fontSize: 24 },
});

export default HomeScreen;