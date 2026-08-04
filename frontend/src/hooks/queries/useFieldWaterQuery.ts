import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useFieldWater = (fieldId: string | undefined) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['fieldWater', fieldId],
    queryFn: async () => {
      const res = await API.get(`/water/field/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        entries: res.data.data,
        totalCost: res.data.totalCost,
        totalHours: res.data.totalHours,
      };
    },
    enabled: !!token && !!fieldId,
  });
};
