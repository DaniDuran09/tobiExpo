/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

export const _axios = axios.create({
  baseURL: 'https://api.tobiapp.mx/api/v1/',
});

export const Interceptor = (store: any) => {
  /**
   * Response interceptor
   */
  _axios.interceptors.response.use((response: any) => response, (error: any) => Promise.reject(error));

  /**
   * Request interceptor
   */
  _axios.interceptors.request.use((config: any) => {
    const { data, params, useToken = false, showPayload = false, overrideToken = false, registerV2 = false } = config;
    //const { work } = store.getState().user;
    const { temporalToken } = store.getState().common;

    if (showPayload && __DEV__) console.log('PAYLOAD ===', data || params);
    //if (token && useToken && !overrideToken) config.headers.Authorization = `Bearer ${token}`;
    //if (temporalToken && useToken && !overrideToken) config.headers.Authorization = `Bearer ${temporalToken}`;
    //if (registerV2) config.headers.common['X-API-Version'] = 2.0;
    return config;

  }, (error: any) => Promise.reject(error));
};