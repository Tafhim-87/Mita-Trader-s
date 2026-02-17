// hooks/useOrders.js
import { useSelector, useDispatch } from 'react-redux';
import { addOrder, initializeDemoOrders, clearOrders } from '@/store/ordersSlice';

export const useOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const totalOrders = useSelector((state) => state.orders.totalOrders);
  const totalRevenue = useSelector((state) => state.orders.totalRevenue);

  // Calculate month-over-month changes
  const getOrderStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Current month orders
    const currentMonthOrders = orders.filter(order => {
      const date = new Date(order.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Last month orders
    const lastMonthOrders = orders.filter(order => {
      const date = new Date(order.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    // Calculate revenue for each period
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate percentage changes
    const orderChange = lastMonthOrders.length 
      ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1)
      : currentMonthOrders.length > 0 ? 100 : 0;

    const revenueChange = lastMonthRevenue
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : currentMonthRevenue > 0 ? 100 : 0;

    return {
      totalOrders,
      totalRevenue,
      currentMonthOrders: currentMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      currentMonthRevenue,
      lastMonthRevenue,
      orderChange: orderChange > 0 ? `+${orderChange}%` : `${orderChange}%`,
      revenueChange: revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`,
    };
  };

  const placeOrder = (orderData) => {
    dispatch(addOrder(orderData));
  };

  const loadDemoData = () => {
    dispatch(initializeDemoOrders());
  };

  const resetOrders = () => {
    dispatch(clearOrders());
  };

  return {
    orders,
    totalOrders,
    totalRevenue,
    getOrderStats,
    placeOrder,
    loadDemoData,
    resetOrders,
  };
};