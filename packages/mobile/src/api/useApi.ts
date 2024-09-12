import {useState} from 'react';
import {apiRequest} from '.';
import {apiMethods} from 'shared';

type CallApiOptions = {
  params?: {[key: string]: string | number | object | Array<string>} | null;
  data?: {[key: string]: string | number | object | Array<string>} | null;
  endpoint: string;
  method: string;
};

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(null);

  const callApi = async (
    options: CallApiOptions = {params: null, endpoint: '', method: apiMethods.get}
  ) => {
    setLoading(true);
    setError(null);
    setData(null);
    setParams(params);

    const response = await apiRequest(options);

    if (response.success) setData(response.data);
    else setError(response?.error?.errors?.[0] || response?.error?.error || response?.error);

    setLoading(false);

    return response;
  };

  return {loading, data, error, callApi, params};
};

export default useApi;
