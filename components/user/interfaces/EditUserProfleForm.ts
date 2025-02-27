interface EditUserProfileForm{
    initialData:UserProfile | undefined
    values:UserProfile
    onChange:(field:keyof UserProfile,value:string)=>void
}

interface UserProfile{
    name:string
    email:string
    phone:string
}