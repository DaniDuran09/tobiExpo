interface LoginRequest {
    username: string;
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

interface SendPinRequest {
    email: string
}

interface SendPinResponse {
    data: string
}

interface UpdatePassordRequest {
    pin: string,
    password: string,
    password_confirmation: string,
}

interface UpdatePasswordResponse {
    data: string
}