import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { cacheFarmers } from '../../utils/cacheFarmers';
import { getCachedFarmers } from '../../utils/getCachedFarmers';

export const useFarmers = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      try {
        const res = await API.get('/farmers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        // Background cache update for offline mode
        cacheFarmers(data).catch(console.error);
        return data;
      } catch (error) {
        if (!navigator.onLine) {
          const cached = await getCachedFarmers();
          if (cached) return cached;
        }
        throw error;
      }
    },
    enabled: !!token,
  });
};
