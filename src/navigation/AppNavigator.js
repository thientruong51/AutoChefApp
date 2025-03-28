import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import CartScreen from "../screens/CartScreen";
import DetailOrderScreen from "../screens/DetailOrderScreen";
import MyOrderScreen from "../screens/MyOrderScreen";
import { createNavigationContainerRef } from "@react-navigation/native";
export const navigationRef = createNavigationContainerRef();
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

  const inactivityTimerRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      navigationRef.current?.navigate("Welcome");
    }, 120000);
  };


  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", () => {
      resetInactivityTimer();
    });
    resetInactivityTimer();
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Details">
          {(props) => <DetailsScreen {...props} addToCart={addToCart} />}
        </Stack.Screen>
        <Stack.Screen name="Cart" options={{ headerShown: false }}>
          {(props) => (
            <CartScreen
              {...props}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="DetailOrder"
          component={DetailOrderScreen}
          options={{ title: "Order Details" }}
        />
        <Stack.Screen
          name="MyOrders"
          component={MyOrderScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
