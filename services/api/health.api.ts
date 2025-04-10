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
        }
    }),
    endpoints: (builder) => ({
        getVaccines: builder.query<ApiResponse<any>, number>({
            query: (id: number) => `/pets/${id}/vaccines`,
        }),
        getVaccinationRecords: builder.query<ApiResponse<any>, number>({
            query: (id) => `/pets/${id}/vaccination_records`,
        }),
        saveVaccine: builder.mutation<ApiResponse<any>, any>({
            query: (data) => ({
                url: `/pets/${data.pet_id}/vaccination_records`,
                method: 'POST',
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
    useSaveDewormerMutation,
} = healthApi;
