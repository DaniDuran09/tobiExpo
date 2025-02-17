interface ServiceOptionProps {
    service: Service,
    picture: string,
    listService: Array<Service>,
    users: Array<User>,
    partnerId: string,
    partnerLocation: string
}

interface User {
    id: number;
    name: string;
    last_name: string;
    display_name: string;
    email: string;
    phone: string;
    username: string;
    picture: string;
    description: string;
    professional_license: string;
}
