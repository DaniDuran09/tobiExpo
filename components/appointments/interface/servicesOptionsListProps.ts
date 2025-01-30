interface Service {
    count_items: number;
    created_at: string;
    description: string;
    discount: string;
    discount_percent: boolean;
    duration_minuts: number;
    id: number;
    name: string;
    picture: string;
    price: string;
    price_total: string;
    service_ownered_id: number;
    service_ownered_type: string;
    status: string;
    tax_percent: string;
    updated_at: string;
}

interface ServiceOptionsListProps {
    services: Array<Service>;
    partnerLocation: string;
    users: Array<User>;
    partnerId: string;
}
