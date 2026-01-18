// hooks/api/categories.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

const CATEGORIES_KEY = ['categories'];

/* ===============================
   GET ALL CATEGORIES
================================ */
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, options],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      
      const url = params.toString() 
        ? `/api/categories?${params.toString()}`
        : '/api/categories';
      
      const { data } = await api.get(url);
      return data.data;
    },
  });
};

/* ===============================
   GET CATEGORY BY ID/SLUG
================================ */
export const useCategory = (idOrSlug, options = {}) => {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, idOrSlug, options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options.lang) params.append('lang', options.lang);
      
      const url = params.toString()
        ? `/api/categories/${idOrSlug}?${params.toString()}`
        : `/api/categories/${idOrSlug}`;
      
      const { data } = await api.get(url);
      return data.data;
    },
    enabled: !!idOrSlug,
  });
};

/* ===============================
   CREATE CATEGORY
================================ */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/api/categories', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

/* ===============================
   UPDATE CATEGORY
================================ */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.patch('/api/categories', { id, ...payload });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: [...CATEGORIES_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

/* ===============================
   DELETE CATEGORY
================================ */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, moveTo, force }) => {
      const params = new URLSearchParams();
      if (id) params.append('id', id);
      if (name) params.append('name', name);
      if (moveTo) params.append('moveTo', moveTo);
      if (force) params.append('force', force);
      
      const { data } = await api.delete(`/api/categories?${params}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

/* ===============================
   GET CATEGORY TREE (Hierarchical)
================================ */
export const useCategoryTree = () => {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, 'tree'],
    queryFn: async () => {
      const { data } = await api.get('/api/categories?parent=null');
      
      // Build tree structure
      const buildTree = async (parentId = null) => {
        const categories = await api.get(`/api/categories?parent=${parentId || 'null'}`);
        const tree = [];
        
        for (const category of categories.data.data) {
          const children = await buildTree(category._id);
          tree.push({
            ...category,
            children
          });
        }
        
        return tree;
      };
      
      return buildTree();
    },
  });
};