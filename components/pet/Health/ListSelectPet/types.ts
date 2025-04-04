interface ListSelectPetProps {
    pets: Pet[];
    selectedPet: Pet;
    setSelectedPet: (pet: Pet) => void;
}