interface Level {
    id: number;
    name: string;
    description: string;
    color: string;
    min_points: number;
    max_points: number;
    status: string;
    picture: string;
    created_at: string;
    updated_at: string;
}
interface ClientLevel {
    id: number;
    level_id: number;
    client_id: number;
    points: string;
    points_level: string;
    description: string;
    created_at: string;
    updated_at: string;
    level: Level
}

interface Pet {
    activity_level_id: number
    birthday: string
    gender: string
    name: string
    pet_breed_id: number
    sterilized: boolean
    interfacePet: number
    weight: string
}

interface User {
    last_sign_in_at: string
    sign_in_count: number;
    display_name: string;
    id: number;
    password_digest: string;
    email: string
    name: string
    last_name: string
    id_openpay: unknown;
    phone: string;
    status: string;
    reset_pwd: unknown;
    locale: string;
    pin: unknown;
    picture: string;
    back_picture: string;
    birthday: unknown;
    age: unknown;
    is_local: boolean;
    deleted_at: unknown;
    addresses: [];
    client_levels: ClientLevel[]
    token: string;
}

interface UpdateUserProfilePictureResponse {

}

interface UpdateUserRequest {
    name?: string,
    last_name?: string,
    email?: string,
    phone?: string,
    birthday?: string,
    age?: number,
}

interface UpdateUserResponse {
    data: {
        addresses: []
        age: null | number
        back_picture: string
        birthday: null | string
        deleted_at: null | string
        display_name: string
        email: string
        id: number
        id_openpay: unknown
        is_local: boolean
        last_name: string
        last_sign_in_at: string
        locale: string
        name: string
        password_digest: string
        phone: string
        picture: string
        pin: unknown
        reset_pwd: unknown
        sign_in_count: number
        status: string
    }
}

interface GetProfileResponse {
    data: {
        last_sign_in_at: string
        sign_in_count: number;
        display_name: string;
        id: number;
        password_digest: string;
        email: string
        name: string
        last_name: string
        id_openpay: unknown;
        phone: string;
        status: string;
        reset_pwd: unknown;
        locale: string;
        pin: unknown;
        picture: string;
        back_picture: string;
        birthday: unknown;
        age: unknown;
        is_local: boolean;
        deleted_at: unknown;
        addresses: [];
        client_levels: ClientLevel[]
        token: string;
        pets: Pet[]
    }
}

interface Blog {
    created_at: string
    description: string
    id: number
    name: string
    picture: string
    status: string
    updated_at: string
    url: string
}
interface GetBlogsResponse {
    data: Blog[]
}