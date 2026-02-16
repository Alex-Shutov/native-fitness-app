import apiClient from '~/shared/api/client';

/**
 * GET /api/body-measurements/statistics
 * Ответ: userId, totalMeasurements, latestMeasurementDate, firstMeasurementDate,
 *        chestChange, waistChange, hipChange
 */
export const getStatistics = async () => {
  const { data } = await apiClient.get('/api/body-measurements/statistics');
  return data ?? {};
};

/**
 * GET /api/body-measurements/history
 * Ответ: массив { id, userId, measurementDate, createdAt, chestCircumference, waistCircumference, hipCircumference }
 */
export const getHistory = async () => {
  const { data } = await apiClient.get('/api/body-measurements/history');
  const list = Array.isArray(data) ? data : [];
  list.sort((a, b) => new Date(b.measurementDate || b.createdAt) - new Date(a.measurementDate || a.createdAt));
  return list;
};

/**
 * GET /api/body-measurements/progress?limit=10
 */
export const getProgress = async (limit = 10) => {
  const { data } = await apiClient.get('/api/body-measurements/progress', { params: { limit } });
  const list = Array.isArray(data) ? data : [];
  list.sort((a, b) => new Date(b.measurementDate || b.createdAt) - new Date(a.measurementDate || a.createdAt));
  return list;
};
