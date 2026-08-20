import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('fio-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('fio-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, specificOptions = {}) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(specificOptions));
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && JSON.stringify(item.options) === JSON.stringify(specificOptions)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, options: specificOptions }];
    });
  };

  const removeFromCart = (productId, specificOptions = {}) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === productId && JSON.stringify(item.options) === JSON.stringify(specificOptions))));
  };

  const updateQuantity = (productId, quantity, specificOptions = {}) => {
    if (quantity <= 0) {
      removeFromCart(productId, specificOptions);
      return;
    }
    setCart(prevCart => prevCart.map(item => 
      (item.id === productId && JSON.stringify(item.options) === JSON.stringify(specificOptions))
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
