export interface TypePartner {
  id: number;
  name: string;
}

export interface Partner {
  id: number;
  name: string;
  type_partner: TypePartner;
  picture: string;
}

export interface SelectServiceProps {
  route: {
    params: {
      type: number;
    };
  };
}

export type NavigationType = {
  navigate: (screen: string, params?: any) => void;
};
