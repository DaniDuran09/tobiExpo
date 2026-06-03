interface PartnerGeneralInfo{
    services:Service[],
    users:User[],
    partner:Partner,
    address:Address
}

interface Partner{
    picture: string | null,
    latitude: string,
    longitude: string,
    name: string,
    id: string,
    partnerId:string
    description:string
    phone:string
    type_partner:{
        id: number
        name: string
    }
}

interface Address{
    state:string
    city:string
    street:string
}