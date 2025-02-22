import { tobiApi } from "./tobiApi"

export const auth = tobiApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            })
        }),
        register: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
            query: (data) => ({
                url: "registers",
                method: "POST",
                body: data
            })
        }),
        sendPin: builder.mutation<SendPinResponse, SendPinRequest>({
            query: (data) => ({
                url: "/forgot/password",
                method: "POST",
                body: data
            })
        }),
        updatePassword: builder.mutation<UpdatePasswordResponse, UpdatePassordRequest>({
            query: (data) => ({
                url: "/forgot/password",
                method: "PUT",
                body: data
            })
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useSendPinMutation,
    useUpdatePasswordMutation
} = auth