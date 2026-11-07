export interface Partner {
    id: string | number;
    name: string;
    description?: string;
    address?: string;
    picture: string | null;
    latitude: string;
    longitude: string;
    rating: number;
    type_partner: {
        id: number;
        name: string;
    };
    next_availability_snippet?: {
        date: string;
        slots: string[];
        has_more: boolean;
    };
}

export interface SelectServiceProps {
    route: {
        params?: {
            serviceId?: number;
            petId?: number;
            type?: number;
            q?: string;
            service_catalog_id?: number;
            catalog_code?: string;
            vaccine_id?: number;
            source?: string;
            preselectedDate?: string;
            preselectedTime?: string;
        };
    };
}

export type NavigationService = {
    navigate: (screen: string, params?: object) => void;
};