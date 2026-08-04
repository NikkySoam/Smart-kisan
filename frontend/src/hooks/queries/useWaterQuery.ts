import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { cacheWaterEntries } from '../../utils/cacheWaterEntries';
import { getCachedWaterEntries } from '../../utils/getCachedWaterEntries';

export const useWaterEntries = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['waterEntries'],
    queryFn: async () => {
      try {
        const res = await API.get('/water', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        cacheWaterEntries(data).catch(console.error);
        return data;
      } catch (error) {
        if (!navigator.onLine) {
          const cached = await getCachedWaterEntries();
          if (cached) return cached;
        }
        throw error;
      }
    },
    enabled: !!token,
  });
};
