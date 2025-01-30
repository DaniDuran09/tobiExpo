interface LoginFormProps {
    onSubmit: (values: { username: string; password: string }) => void;
}

interface LoginPayload {
    username: string,
    password: string,
}