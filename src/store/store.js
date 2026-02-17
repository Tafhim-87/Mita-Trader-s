// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice'; // Add this

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer, // Add this
  },
});