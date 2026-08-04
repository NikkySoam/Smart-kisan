import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useFieldInsights = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['fieldInsights'],
    queryFn: async () => {
      const res = await API.get('/fields/insights', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });
};
