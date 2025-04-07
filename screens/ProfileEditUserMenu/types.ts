interface UserData {
  picture?: string;
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

type RootStackParamList = {
  LoginScreen: {};
  ProfileEditUser: {};
  ChangePassword: {};
};
