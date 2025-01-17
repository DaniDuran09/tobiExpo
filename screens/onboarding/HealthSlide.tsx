import { View } from "react-native-ui-lib";
import Description from "./Description";
import Title from "./Title";
import Header from "./Header";

export default function HealthSlide() {
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
        <Title text={"Salud y bienestar\npara tu mascota en\nun solo lugar"}/>
        <Description text={"Los mejores productos,\nservicios y especialistas"}/>
      </View>
    </View>
  );
}
