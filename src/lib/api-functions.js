// lib/api-functions.js
import api from '@/lib/axios';

export async function getBestBook() {
  const { data } = await api.get('/api/books/best-of-month');
  return data.data;
}

export async function getBooks() {
  const { data } = await api.get('/api/books/all');
  return data.data;
}

export async function getCategories() {
  const { data } = await api.get('/api/books/categories');
  return data.data;
}

export async function getMonthlyStats() {
  const { data } = await api.get('/api/books/stats/monthly');
  return data.data;
}