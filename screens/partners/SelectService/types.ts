export interface Partner {
    id: string | number;
    name: string;
    description?: string;
    picture: string | null;
    latitude: string;
    longitude: string;
    rating: number;
    type_partner: {
        id: number;
        name: string;
    };
}

export interface SelectServiceProps {
    route: {
        params: {
            serviceId?: number;
            petId?: number;
            type: number;
            q?: string;
        };
    };
}

export type NavigationService = {
    navigate: (screen: string, params?: object) => void;
};