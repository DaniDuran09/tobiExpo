 interface Partner {
  id: number;
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

 type NavigationType = {
  navigate: (screen: string, params?: object) => void;
};
