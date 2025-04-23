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
            query: () => '/pets',
            keepUnusedDataFor: 0
        }),
        getPetById: builder.query<Pet, number>({
            query: (id) => `/pets/${id}`,
            keepUnusedDataFor: 0
        }),
        createPet: builder.mutation<Pet, Partial<Pet>>({
            query: (data) => ({
                url: '/pets',
                method: 'POST',
                body: data,
            }),
        }),
        updatePet: builder.mutation<Pet, { id: number; data: Partial<Pet> }>({
            query: ({ id, data }) => ({
                url: `/pets/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deletePet: builder.mutation<void, number>({
            query: (id) => ({
                url: `/pets/${id}`,
                method: 'DELETE',
            }),
        }),
        updatePetPicture: builder.mutation<Pet, { id: number; image: FormData }>({
            query: ({ id, image }) => ({
                url: `/pets/save/picture/${id}`,
                method: 'PUT',
                body: image,
            }),
        }),
        getPetBreeds: builder.query<any[], number>({
            query: (typeId) => `/pets_breeds?type_pet=${typeId}`,
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
