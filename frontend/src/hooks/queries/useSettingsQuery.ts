import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { cacheSettings } from '../../utils/cacheSettings';
import { getCachedSettings } from '../../utils/getCachedSettings';

export const useSettings = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const res = await API.get('/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        cacheSettings(data).catch(console.error);
        return data;
      } catch (error) {
        if (!navigator.onLine) {
          const cached = await getCachedSettings();
          if (cached) return cached;
        }
        throw error;
      }
    },
    enabled: !!token,
  });
};
