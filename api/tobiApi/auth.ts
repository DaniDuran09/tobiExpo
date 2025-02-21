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
        })
    })
})

export const { useLoginMutation, useRegisterMutation } = auth