import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL } from '@env';
import AppStorage from '../../modules/AppStorage';

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
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
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<ApiResponse<Notification[]>, void>({
            query: () => '/notifications',
            providesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
} = notificationsApi;
