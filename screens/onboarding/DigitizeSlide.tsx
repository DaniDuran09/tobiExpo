import { View} from "react-native-ui-lib";
import Description from "./Description";
import Title from "./Title";
import Header from "./Header";

export default function DigitalizeSlide() {
  return (
    <View
      style={{
        backgroundColor: "#EF4136", //#E6F8DB
      }}
    >
      <Header/>
      <View
        style={{
          height: "80%",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "10%",
        }}
      >    
        <Title text="Digitaliza la cartilla de vacunación de tu mascota"/> 
        <Description text={"Llévala siempre contigo, de manera digital y segura"}/>
      </View>
    </View>
  );
}
