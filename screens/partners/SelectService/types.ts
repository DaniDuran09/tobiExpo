 interface TypePartner {
  id: number;
  name: string;
}

 interface Partner {
  id: number;
  name: string;
  type_partner: TypePartner;
  picture: string;
}

 interface SelectServiceProps {
  route: {
    params: {
      type: number;
    };
  };
}

 type NavigationType = {
  navigate: (screen: string, params?: any) => void;
};