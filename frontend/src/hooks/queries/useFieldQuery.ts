import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { cacheFields } from '../../utils/cacheFields';
import { getCachedFields } from '../../utils/getCachedFields';

export const useFieldsWithAnalytics = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['fieldsWithAnalytics'],
    queryFn: async () => {
      try {
        const res = await API.get('/fields', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fields = res.data.data;

        const analyticsData: Record<string, any> = {};
        for (const field of fields) {
          const details = await API.get(`/fields/${field._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          analyticsData[field._id] = details.data.totals;
        }

        const result = { fields, analytics: analyticsData };
        cacheFields(result).catch(console.error);
        return result;
      } catch (error) {
        if (!navigator.onLine) {
          const cached = await getCachedFields();
          if (cached) return cached;
        }
        throw error;
      }
    },
    enabled: !!token,
  });
};

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

export const useFieldDetails = (id: string | undefined) => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['fields', id],
    queryFn: async () => {
      const res = await API.get(`/fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token && !!id,
  });
};
