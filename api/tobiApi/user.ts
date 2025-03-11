import { tobiApi } from "./tobiApi"

const userApi = tobiApi.injectEndpoints({
    endpoints: (builder) => ({
        updatePictureProfile: builder.mutation<UpdateUserProfilePictureResponse, FormData>({
            query: (data) => ({
                url: "/profile/save/picture",
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: data
            }),
        }),
        updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
            query: (data) => ({
                url: "/profile/update/information",
                method: "PUT",
                body: data
            }),
            invalidatesTags:["Profile"]
        }),
        getProfile: builder.query<GetProfileResponse, undefined>({
            query: () => "/profile",
            providesTags:["Profile"]
        }),
        getBlogs: builder.query<GetBlogsResponse, void>({
            query: () => "/blogs"
        })
    })
})

export const {
    useUpdatePictureProfileMutation,
    useUpdateUserMutation,
    useGetProfileQuery,
    useLazyGetProfileQuery,
    useGetBlogsQuery
} = userApi