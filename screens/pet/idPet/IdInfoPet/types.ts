import { RouteProp } from "@react-navigation/native";

interface PetBreed {
  name: string;
  life_stages?: { gender: string }[];
}

interface Pet {
  picture?: string;
  name?: string;
  age?: string;
  pet_breed: PetBreed;
}

type RootStackParamList = {
  IdInfoPet: { pet: Pet };
};

 export interface IdInfoPetProps {
  route: RouteProp<RootStackParamList, "IdInfoPet">;
}
