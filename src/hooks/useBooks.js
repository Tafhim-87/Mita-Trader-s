// hooks/api/books.js - Updated
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

/* ===============================
   QUERY KEYS
================================ */
const BOOKS_KEY = ['books'];

/* ===============================
   GET ALL BOOKS WITH FILTERS
   GET /api/books?page=1&limit=12&category=fiction&minRating=4&sortBy=rating&order=desc
================================ */
export const useBooks = (filters = {}) => {
  return useQuery({
    queryKey: [...BOOKS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add all filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            // Handle array values (e.g., multiple categories)
            if (value.length > 0) {
              params.append(key, value.join(','));
            }
          } else {
            params.append(key, value);
          }
        }
      });
      
      const url = params.toString() 
        ? `/api/books?${params.toString()}`
        : '/api/books';
      
      const { data } = await api.get(url);
      return data;
    },
  });
};

/* ===============================
   GET ALL BOOKS (for backward compatibility)
================================ */
export const useAllBooks = () => {
  return useQuery({
    queryKey: [...BOOKS_KEY, 'all'],
    queryFn: async () => {
      const { data } = await api.get('/api/books/all');
      return data.data;
    },
  });
};

/* ===============================
   GET SINGLE BOOK
   GET /api/books/:id
================================ */
export const useBook = (id) => {
  return useQuery({
    queryKey: [...BOOKS_KEY, id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get(`/api/books/${id}`);
      return data.data;
    },
  });
};

/* ===============================
   CREATE BOOK
   POST /api/books
================================ */
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/api/books', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_KEY });
    },
  });
};

/* ===============================
   UPDATE BOOK (Full Replace)
   PUT /api/books/:id
================================ */
export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/api/books/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKS_KEY });
      queryClient.invalidateQueries({ queryKey: [...BOOKS_KEY, variables.id] });
    },
  });
};


/* ===============================
   DELETE BOOK
   DELETE /api/books/:id
================================ */
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/api/books/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_KEY });
    },
  });
};

/* ===============================
   GET BOOK STATS (for filters)
================================ */
export const useBookStats = () => {
  return useQuery({
    queryKey: [...BOOKS_KEY, 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/api/books/stats');
      return data.data;
    },
  });
};

/* ===============================
   GET RELATED BOOKS
   GET /api/books?category=sameCategory&limit=4
================================ */
export const useRelatedBooks = (bookId, category, limit = 4) => {
  return useQuery({
    queryKey: [...BOOKS_KEY, 'related', bookId],
    enabled: !!bookId && !!category,
    queryFn: async () => {
      const { data } = await api.get(`/api/books?category=${category}&limit=${limit}&exclude=${bookId}`);
      return data.data;
    },
  });
};

/* ===============================
   PATCH BOOK (Partial Update)
   PATCH /api/books/:id
================================ */
export const usePatchBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.patch(`/api/books/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      // Refresh list + single book
      queryClient.invalidateQueries({ queryKey: BOOKS_KEY });
      queryClient.invalidateQueries({ queryKey: [...BOOKS_KEY, variables.id] });
    },
  });
};
