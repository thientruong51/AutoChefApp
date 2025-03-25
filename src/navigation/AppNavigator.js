import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CartScreen from '../screens/CartScreen';
import DetailOrderScreen from '../screens/DetailOrderScreen'; // Import màn hình chi tiết đơn hàng
import MyOrderScreen from '../screens/MyOrderScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details">
          {(props) => <DetailsScreen {...props} addToCart={addToCart} />}
        </Stack.Screen>
        <Stack.Screen name="Cart">
          {(props) => <CartScreen {...props} cartItems={cartItems} removeFromCart={removeFromCart} />}
        </Stack.Screen>
        <Stack.Screen name="DetailOrder" component={DetailOrderScreen} options={{ title: "Order Details" }} />
        <Stack.Screen name="MyOrders" component={MyOrderScreen} options={{ headerShown: false }}   />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
