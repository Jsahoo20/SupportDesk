import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, options);
      setData(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
