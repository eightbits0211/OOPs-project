import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('liveMartCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('liveMartCart', JSON.stringify(cart));
  }, [cart]);

  // UPDATED: Accepts a specific quantity (default is 1)
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // If item exists, add the new quantity to the existing one
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // If new, add with the selected quantity
      return [...prev, { ...product, quantity: quantity }];
    });
  };

  // NEW: Allow changing quantity directly in the cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent going below 1
    setCart((prev) => prev.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);