// store/ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  totalRevenue: 0,
  totalOrders: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const newOrder = {
        id: Date.now().toString(), // Simple unique ID
        ...action.payload,
        date: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}`,
      };
      
      state.orders.push(newOrder);
      state.totalOrders = state.orders.length;
      state.totalRevenue = state.orders.reduce(
        (sum, order) => sum + (order.total || 0), 
        0
      );
    },
    
    // Optional: Add this if you want to initialize with some demo data
    initializeDemoOrders: (state) => {
      // Add some demo orders for testing
      const demoOrders = [
        {
          id: '1',
          orderNumber: 'ORD-20240215-001',
          total: 45.99,
          date: '2024-02-15T10:30:00Z',
          items: 2,
          status: 'delivered'
        },
        {
          id: '2',
          orderNumber: 'ORD-20240214-001',
          total: 89.50,
          date: '2024-02-14T15:45:00Z',
          items: 3,
          status: 'delivered'
        },
        {
          id: '3',
          orderNumber: 'ORD-20240213-001',
          total: 120.00,
          date: '2024-02-13T09:15:00Z',
          items: 5,
          status: 'processing'
        },
      ];
      
      state.orders = demoOrders;
      state.totalOrders = demoOrders.length;
      state.totalRevenue = demoOrders.reduce((sum, order) => sum + order.total, 0);
    },
    
    clearOrders: (state) => {
      state.orders = [];
      state.totalRevenue = 0;
      state.totalOrders = 0;
    },
  },
});

export const { addOrder, initializeDemoOrders, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;