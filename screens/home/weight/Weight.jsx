import { Image, StyleSheet, ScrollView} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../../../styles/Colors";
import Recomendation from "../../../components/Recomendation";
import ChallengeModal from "../../../components/ChallengeModal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { calculateIdealWeight } from "../../../utils/scripts";
import CorrectWeight from "../../../components/pet/CorrectWeight";
import ApiFetcher from "../../../modules/ApiFetcher";
import Loading from "../../../components/Loading";
import { View,Card,Text,TouchableOpacity } from "react-native-ui-lib";

const Weight = (props) => {
  const { item } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState({});
  const navigation = useNavigation();
  const [challengeVisible, setChallengeVisible] = useState();

  const apiFetcher = new ApiFetcher();

  const closeModalChallenge = () => {
    setChallengeVisible(false);
  };

  const rangeOne = pet?.ideal_weight?.from / 1000;
  const rangeTwo = pet?.ideal_weight?.to / 1000;

  const realWeight = calculateIdealWeight(rangeOne, rangeTwo, parseInt(pet?.weight));

  const getPet = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPetById(item.id);
      setPet(response.data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPet();
      return () => {};
    }, [navigation])
  );


  useEffect(() => {
    setSuccess(realWeight?.ideal);
  }, [pet]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
     
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
        <CardInfo title="Real" image={require("../../../assets/balance.png")}>
          <Text
            marginT-20
            text60BO
            color={realWeight?.ideal?Colors.green:Colors.primaryColor}                          
            >
              {parseInt(pet.weight)} kg
            </Text>           
            <Text marginT-25 style={styles.lastUpdate}>Último registro: {pet.weight_updated_at ? pet.weight_updated_at : "Sin fecha"}</Text>            

            <TouchableOpacity
              marginT-10              
              onPress={() =>
                navigation.navigate("EditPet", {
                  id: item.id,
                })
              }
            >
              <Text underline style={styles.updateTetx}>Actualizar peso real</Text>            
            </TouchableOpacity>
        </CardInfo>

        <CardInfo title="Rango ideal" image={require("../../../assets/balance.png")}>
          <Text
              marginT-10
              text80BO              
            >{`${rangeOne} Kg - ${rangeTwo} Kg`}
          </Text>
        </CardInfo>
              
        {success ? (
          <CorrectWeight />
        ) : (
          <Recomendation
            title={"Recomendación"}
            info={
              "Programa una cita con un especialista en nutrición para el cuidado de tu mascota."
            }
            setVisible={setChallengeVisible}
            oneOption={true}
          />
        )}
        <ChallengeModal
          closeModalChallenge={closeModalChallenge}
          challengeVisible={challengeVisible}
          text={
            "El bienestar de tu mascota es lo más importante. Consulta a un especialista para asegurarte de que esté en el rango ideal."
          }
        />      
    </ScrollView>
  );
};

const CardInfo = ({title,image,children})=>{
  return (
    <Card padding-15 br8 backgroundColor={Colors.mediumWhite} style={styles.realWeightContainer} >
      <View row centerV>
          <Image
            source={image}
            style={styles.imageBalance}                       
          />
          <Text text65 style={styles.realText}>{title}</Text>
      </View>
      {children}
    </Card>
  )
}

export default Weight;

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  contentContainer:{
    backgroundColor: Colors.white,
    padding:15
  },
  realWeightContainer: {   
    marginBottom: "5%",
  },
  imageBalance: {
    width:20,
    height:20,
  }, 
  realText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },
 
  lastUpdate: {    
    fontWeight: "300",
  },
  updateTetx: {
    fontWeight: "500",
  },
});
