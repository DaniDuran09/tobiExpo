 interface LoginRequest {
    identifier: string;
    password: string;
};

 interface LoginResponse {
    data: User
};

 interface RegisterUserRequest {
    birthday: string
    email: string
    last_name: string
    name: string
    password: string
    phone: string
    pet: Pet
}

 interface RegisterUserResponse {
    data: User
}

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