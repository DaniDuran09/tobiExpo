 interface UserData {
    picture?: string;
    // Puedes agregar más campos aquí si tu objeto de usuario tiene más propiedades.
  }
  
   interface ImageSource {
    uri: string;
  }
  
   interface ApiFetcher {
    getProfile(): Promise<{ data: UserData }>;
  }
  
   interface AppStorage {
    clearStorage(): Promise<void>;
  }
  
   interface NavigationProps {
    navigate: (screen: string) => void;
    reset: (options: { index: number, routes: { name: string }[] }) => void;
  }
  
   interface LoadingProps {
    textColor: string;
    backgroundColorProp: string;
  }
  
