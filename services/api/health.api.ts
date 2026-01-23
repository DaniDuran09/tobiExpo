import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL } from '@env';
import AppStorage from '../../modules/AppStorage';

export const healthApi = createApi({
  reducerPath: 'healthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
    prepareHeaders: async (headers) => {
      const token = await new AppStorage().getAppToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getVaccines: builder.query<ApiResponse<any>, number>({
      query: (id: number) => `/v1/portal_client/pets/${id}/vaccines`,
      keepUnusedDataFor: 0,
    }),

    getVaccinationRecords: builder.query<ApiResponse<any>, number>({
      query: (id) => `/v1/portal_client/pets/${id}/vaccination_records`,
      keepUnusedDataFor: 0,
    }),

    saveVaccine: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: `/v1/portal_client/pets/${data.pet_id}/vaccination_records`,
        method: 'POST',
        body: data,
      }),
    }),

    updateVaccine: builder.mutation<ApiResponse<any>, any>({
  query: (data) => ({
    url: `/v1/portal_client/pets/${data.pet_id}/vaccination_records/${data.record_id}`,
    method: 'PUT', // o PATCH si tu back lo soporta
    body: data,
  }),
}),

updateDewormer: builder.mutation<ApiResponse<any>, any>({
  query: (data) => ({
    url: `/pets/${data.pet_id}/dewormer_records/${data.record_id}`,
    method: 'PUT',
    body: data,
  }),
}),


    saveDewormer: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: `/pets/${data.pet_id}/dewormer_records`,
        method: 'POST',
        body: data,
      }),
    }),

    
  }),
});

export const {
  useGetVaccinesQuery,
  useGetVaccinationRecordsQuery,
  useSaveVaccineMutation,
  useUpdateVaccineMutation,
  useSaveDewormerMutation,
  useUpdateDewormerMutation,
} = healthApi;
