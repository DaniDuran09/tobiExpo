interface OpenDirectionMapProps {
    latitude: string;
    longitude: string;
    setShowActionSheet: (show: boolean) => void;
    showActionSheet: boolean;
};

interface OpenMap{
    latitude: string;
    longitude: string;
    app: string;
}