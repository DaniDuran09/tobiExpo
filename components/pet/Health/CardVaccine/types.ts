interface CardVaccineProps {
    idPet: number;
    vaccineBrands: string[];
    item: Vaccine;
    setIdEditPet: (id: number) => void;
    idEditPet: number | null;
    refreshData: () => void;
}