// hooks/useCartCount.js
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useCartCount = () => {
  const cartItems = useSelector((state) => state.cart.items);
  
  return useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );
};

