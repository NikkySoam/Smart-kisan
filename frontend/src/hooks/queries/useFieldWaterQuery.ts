import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useFieldWater = (fieldId: string | undefined) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['fieldWater', fieldId],
    queryFn: async () => {
      const res = await API.get(`/field-water/field/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        entries: Array.isArray(res.data.data) ? res.data.data : [],
        totalCost: Number(res.data.totalCost) || 0,
        totalHours: Number(res.data.totalHours) || 0,
      };
    },
    enabled: !!token && !!fieldId,
  });
};
