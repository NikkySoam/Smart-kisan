import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useNotifications = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await API.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });
};
