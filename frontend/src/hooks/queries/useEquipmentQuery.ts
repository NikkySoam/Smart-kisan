import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useEquipment = (fieldId: string | undefined) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['equipment', fieldId],
    queryFn: async () => {
      const res = await API.get(`/equipment/field/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        entries: Array.isArray(res.data.data) ? res.data.data : [],
        totalCost: Number(res.data.totalAmount) || 0,
      };
    },
    enabled: !!token && !!fieldId,
  });
};
