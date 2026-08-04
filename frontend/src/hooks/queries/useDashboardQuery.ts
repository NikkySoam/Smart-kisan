import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { cacheWaterStats } from '../../utils/cacheWaterStats';
import { getCachedWaterStats } from '../../utils/getCachedWaterStats';

export const useDashboardStats = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const res = await API.get('/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        cacheWaterStats(data).catch(console.error);
        return data;
      } catch (error) {
        if (!navigator.onLine) {
          const cached = await getCachedWaterStats();
          if (cached) return cached;
        }
        throw error;
      }
    },
    enabled: !!token,
  });
};
