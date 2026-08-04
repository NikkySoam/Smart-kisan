import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useAIHistory = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['aiHistory'],
    queryFn: async () => {
      const res = await API.get('/ai/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });
};
