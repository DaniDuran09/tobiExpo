import { URL } from "@env"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const tobiApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: URL }),
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

export const { useLoginMutation, useRegisterMutation } = tobiApi