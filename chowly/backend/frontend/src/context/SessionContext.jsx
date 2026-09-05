import React, { createContext, useContext, useEffect, useState } from "react";

// Holds the current customer's table session (visitId/customerId/tableNumber) and
// the in-progress cart. Persisted to localStorage so a page refresh doesn't lose the
// table session — the app's version of "real storage" on the client side.
const SessionContext = createContext(null);

const STORAGE_KEY = "chowly_session_v1";
const CART_KEY = "chowly_cart_v1";
const RESTAURANT_KEY = "chowly_restaurant_v1";

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [restaurant, setRestaurantState] = useState(() => {
    const saved = localStorage.getItem(RESTAURANT_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (restaurant) localStorage.setItem(RESTAURANT_KEY, JSON.stringify(restaurant));
    else localStorage.removeItem(RESTAURANT_KEY);
  }, [restaurant]);

  function setRestaurant(r) {
    setRestaurantState(r);
  }

  function changeRestaurant() {
    // Switching restaurants mid-visit doesn't make sense (a table belongs to one
    // restaurant), so clear the visit/cart along with the restaurant choice.
    setRestaurantState(null);
    setSession(null);
    setCart([]);
  }

  function startSession({ visitId, customerId, tableNumber, fullName }) {
    setSession({ visitId, customerId, tableNumber, fullName });
  }

  function endSession() {
    setSession(null);
    setCart([]);
  }

  function addToCart(menuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItemId: menuItem.id, itemName: menuItem.itemName, price: menuItem.price, quantity: 1 }];
    });
  }

  function updateQuantity(menuItemId, quantity) {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.menuItemId !== menuItemId)
        : prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        startSession,
        endSession,
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        restaurant,
        setRestaurant,
        changeRestaurant,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
