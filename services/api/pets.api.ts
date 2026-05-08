import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL } from '@env';
import AppStorage from '../../modules/AppStorage';

export const petsApi = createApi({
    reducerPath: 'petsApi',
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
        getPets: builder.query<ApiResponse<Pet[]>, void>({
            query: () => '/v1/portal_client/pets',
            keepUnusedDataFor: 0
        }),
        getPetById: builder.query<Pet, number>({
            query: (id) => `/v1/portal_client/pets/${id}`,
            keepUnusedDataFor: 0
        }),
        createPet: builder.mutation<Pet, Partial<Pet>>({
            query: (data) => ({
                url: '/v1/portal_client/pets',
                method: 'POST',
                body: data,
            }),
        }),
        updatePet: builder.mutation<Pet, { id: number; data: Partial<Pet> }>({
            query: ({ id, data }) => ({
                url: `/v1/portal_client/pets/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deletePet: builder.mutation<void, number>({
            query: (id) => ({
                url: `/v1/portal_client/pets/${id}`,
                method: 'DELETE',
            }),
        }),
        updatePetPicture: builder.mutation<Pet, { id: number; image: FormData }>({
            query: ({ id, image }) => ({
                url: `/v1/portal_client/pets/save/picture/${id}`,
                method: 'PUT',
                body: image,
            }),
        }),
        getPetBreeds: builder.query<any[], number>({
            query: (typeId) => `/v1/portal_client/pets_breeds?type_pet=${typeId}`,
            keepUnusedDataFor: 0
        }),
    }),
});

export const {
    useGetPetsQuery,
    useGetPetByIdQuery,
    useCreatePetMutation,
    useUpdatePetMutation,
    useDeletePetMutation,
    useUpdatePetPictureMutation,
    useGetPetBreedsQuery,
} = petsApi;
