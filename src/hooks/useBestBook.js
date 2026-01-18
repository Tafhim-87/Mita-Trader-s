import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

const BEST_BOOK_KEY = ['best-book'];

/* ===============================
   GET BEST BOOK
   GET /api/books/best-of-month
================================ */
export const useBestBook = () => {
  return useQuery({
    queryKey: BEST_BOOK_KEY,
    queryFn: async () => {
      const { data } = await api.get('/api/books/best-of-month');
      return data.data;
    },
  });
};

/* ===============================
   SET BEST BOOK
   POST /api/books/best-of-month
================================ */
export const useSetBestBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.post('/api/books/best-of-month', { bookId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BEST_BOOK_KEY });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

/* ===============================
   UPDATE BEST BOOK
   PUT /api/books/best-of-month
================================ */
export const useUpdateBestBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId) => {
      const { data } = await api.put('/api/books/best-of-month', { bookId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BEST_BOOK_KEY });
    },
  });
};

/* ===============================
   REMOVE BEST BOOK
   DELETE /api/books/best-of-month
================================ */
export const useRemoveBestBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/api/books/best-of-month');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BEST_BOOK_KEY });
    },
  });
};
