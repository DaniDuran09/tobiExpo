export interface ServiceListProps {
  imageSource: any; 
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export type NavigationType = {
  navigate: (screen: string, params?: { type: number }) => void; 
};
