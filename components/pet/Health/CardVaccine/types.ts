interface CardVaccineProps {
    idPet: number;
    vaccineBrands: string[];
    item: any;
    setIdEditPet: (id: string | number | null) => void;
    idEditPet: string | number | null;
    refreshData: () => void;
    type?: string; 
}