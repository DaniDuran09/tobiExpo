interface CardVaccineProps {
    idPet: number;
    vaccineBrands: string[];
    dewormersFrequency?: { text: string; days: number }[];
    item: any;
    setIdEditPet: (id: string | number | null) => void;
    idEditPet: string | number | null;
    refreshData: () => void;
    type?: string; 
}