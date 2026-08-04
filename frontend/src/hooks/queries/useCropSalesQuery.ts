import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';

export const useCropSales = (fieldId: string | undefined) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['cropSales', fieldId],
    queryFn: async () => {
      const res = await API.get(`/crop-sales/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token && !!fieldId,
  });
};
