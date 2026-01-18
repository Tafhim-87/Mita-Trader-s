// hooks/api/stats.js
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useMonthlyStats = () => {
  return useQuery({
    queryKey: ['stats', 'monthly'],
    queryFn: async () => {
      const { data } = await api.get('/api/books/stats/monthly');
      return data.data;
    },
  });
};