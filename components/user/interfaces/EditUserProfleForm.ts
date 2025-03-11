interface EditUserProfileForm {
    values: UserProfile
    onChange: (field: keyof UserProfile, value: string) => void
}

interface UserProfile {
    name: string|undefined
    email: string|undefined
    phone: string|undefined
}