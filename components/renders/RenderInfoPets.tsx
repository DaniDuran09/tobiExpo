import { Image, Text, View } from "react-native-ui-lib";

type RenderInfoPetsProps = {
  icon: any;
  label: string;
  value: string | number | undefined;
};

const RenderInfoPets = ({ icon, label, value }: RenderInfoPetsProps) => {
  return (
    <>
      <View row marginT-15>
        <View
          width={"10%"}
          height={30}
          center
          paddingR-5
        >
          <Image
            source={icon}  
            style={{ height: 25, width: 25, }}
            resizeMode="contain"
          />
        </View>
        <Text text70L>{label}</Text>
      </View>

      <View row paddingB-10 >
        <View width={"10%"} />
        <Text text70BL>{value}</Text>
      </View>
    </>
  );
};

export default RenderInfoPets;
