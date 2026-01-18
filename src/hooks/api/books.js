// Add to hooks/api/books.js
/* ===============================
   GET CATEGORIES
   GET /api/books/categories
================================ */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/api/books/categories');
      return data.data;
    },
  });
};