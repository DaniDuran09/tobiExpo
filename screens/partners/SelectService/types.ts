interface Partner {
    id: string;
    name: string;
    type_partner: {
        id: number;
        name: string;
    };
}

interface SelectServiceProps {
    route: {
        params: {
            type: number;
        };
    };
}

type NavigationService = {
    navigate: (screen: string, params?: object) => void;
};