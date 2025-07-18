import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, user }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const saveTimeout = useRef(null);

  // Fetch cart from backend on mount or when user changes
  useEffect(() => {
    if (!user) {
      setCart([]);
      setSubtotal(0);
      setTax(0);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get(`/api/cart/`, { headers: { Authorization: `Token ${user.token}` } })
      .then((res) => {
        if (res.data && Array.isArray(res.data.items)) {
          setCart(res.data.items);
          setSubtotal(res.data.subtotal || 0);
          setTax(res.data.tax || 0);
          setTotal(res.data.total || 0);
        } else {
          setCart([]);
          setSubtotal(0);
          setTax(0);
          setTotal(0);
        }
      })
      .catch((err) => {
        setError("Failed to fetch cart.");
        setCart([]);
        setSubtotal(0);
        setTax(0);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Debounced save to backend
  const saveCartToBackend = useCallback(
    (newCart) => {
      if (!user) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        axios
          .post(
            `/api/cart/save/`,
            { cart: newCart },
            { headers: { Authorization: `Token ${user.token}` } }
          )
          .catch(() => setError("Failed to save cart."));
      }, 500); // 500ms debounce
    },
    [user]
  );

  // Update cart and trigger debounced save
  const updateCart = (newCart) => {
    if (!Array.isArray(newCart)) {
      setError("Cart data is invalid.");
      return;
    }
    setCart(newCart);
    saveCartToBackend(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Add item to cart
  const addToCart = (item) => {
    if (!item || !item.id) {
      setError("Invalid item.");
      return;
    }
    const exists = cart.find((i) => i.id === item.id);
    let newCart;
    if (exists) {
      newCart = cart.map((i) =>
        i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }
    updateCart(newCart);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    if (!itemId) {
      setError("Invalid item ID.");
      return;
    }
    const newCart = cart.filter((i) => i.id !== itemId);
    updateCart(newCart);
  };

  // Clear cart
  const clearCart = () => {
    updateCart([]);
  };

  // ✅ Update quantity of specific item
  const updateQuantity = (id, newQty) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    updateCart(newCart);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        tax,
        total,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        setError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
