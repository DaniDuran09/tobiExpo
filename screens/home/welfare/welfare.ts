interface ActivityLevel {
    max_steps: number;
    min_steps: number | string;
    name: string;
}

interface IdealWeight {
    from: number;
    to: number;
}

interface PetSize {
   // Pendiente...
}

interface TypePet {
   value: string
}

interface PetBreed {
    description: string;
    life_stages: any[];
    name: string;
    pet_size: PetSize;
    type_pet: TypePet;
}

interface WeightStatus {
    ideal_weight: IdealWeight;
    weight: string;
}

interface Pet {
    activity_level: ActivityLevel;
    activity_level_id: number;
    age: number;
    birthday: string;
    color: string;
    display_name: string;
    food_brand_id: number;
    id: number;
    ideal_weight: IdealWeight;
    last_name: string;
    name: string;
    pet_breed: PetBreed;
    pet_breed_id: number;
    picture: string;
    service_date: string | null;
    status: string | undefined;
    type_food_id: number;
    weight: string;
    weight_spot: string;
    weight_status: WeightStatus;
}

interface WelfareProps {
    pet: Pet;
}
