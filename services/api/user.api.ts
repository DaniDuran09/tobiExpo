import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL } from '@env';
import AppStorage from '../../modules/AppStorage';

export const userApi = createApi({
    reducerPath: 'userApi',
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
        getProfile: builder.query<ApiResponse<User>, void>({
            query: () => '/profile',
        }),
        updateProfile: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: '/profile',
                method: 'PUT', 
                body: data,
            }),
        }),
        updateProfilePicture: builder.mutation<User, FormData>({
            query: (image) => ({
                url: '/profile/picture',
                method: 'PUT',
                body: image,
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUpdateProfilePictureMutation,
} = userApi;
