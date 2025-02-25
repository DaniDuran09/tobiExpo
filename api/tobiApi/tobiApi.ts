import { URL } from "@env"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import AppStorage from "../../modules/AppStorage"

export const tobiApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: URL,
        prepareHeaders: async (headers, { getState }) => {
            const appStorage = new AppStorage()
            let token = null
            try {
                token = await appStorage.getAppToken()
            } catch (error) {
                token = null
            }

            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes:["Profile"],
    endpoints: () => ({})
})