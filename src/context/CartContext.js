import React, { createContext, useState } from "react";

// Tạo Context cho giỏ hàng
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Giỏ hàng lưu trữ trong state
  const [cartItems, setCartItems] = useState([]);

  // Hàm thêm món vào giỏ hàng
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  // Hàm xóa món khỏi giỏ hàng
  const removeFromCart = (recipeId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.recipeId !== recipeId));
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
