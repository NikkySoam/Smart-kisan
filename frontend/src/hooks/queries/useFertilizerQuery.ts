import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useFertilizers = (fieldId: string | undefined) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['fertilizers', fieldId],
    queryFn: async () => {
      const res = await API.get(`/fertilizers/field/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        entries: res.data.data,
        totalCost: res.data.totalCost,
      };
    },
    enabled: !!token && !!fieldId,
  });
};
