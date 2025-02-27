import { TextInput } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export default function EditUserProfileForm({ values, onChange }: EditUserProfileForm) {

    return (
        <View style={{ width: "100%", marginLeft: "5%" }}>
            <Text marginT-20 marginB-5 text80>
                Nombre
            </Text>
            <TextInput
                placeholder="Nombre"
                placeholderTextColor={Colors.black}
                value={values.name}
                style={{
                    height: 60,
                    width: "90%",
                    paddingLeft: 20,
                    justifyContent: "center",
                    backgroundColor: "#D6EFFF",
                    borderRadius: 4,
                    elevation: 5,
                    color: Colors.black
                }}
                autoCapitalize="none"
                onChangeText={(val) =>
                    onChange("name", val)
                }
            />
            <Text marginT-20 marginB-5 text80>Correo</Text>

            <TextInput
                placeholder="Correo electronico"
                value={values.email}
                placeholderTextColor={Colors.black}
                style={{
                    height: 60,
                    width: "90%",
                    paddingLeft: 20,
                    justifyContent: "center",
                    backgroundColor: "#D6EFFF",
                    borderRadius: 4,
                    elevation: 5,
                    color: Colors.black
                }}
                autoCapitalize="none"
                onChangeText={(val) =>
                    onChange("email", val)
                }
            />
            <Text marginT-20 marginB-5 text80>Teléfono</Text>
            <TextInput

                keyboardType="numeric"
                placeholder="Telefono"
                value={values.phone}
                placeholderTextColor={Colors.black}
                maxLength={10}
                style={{
                    height: 60,
                    width: "90%",
                    paddingLeft: 20,
                    justifyContent: "center",
                    backgroundColor: "#D6EFFF",
                    borderRadius: 4,
                    elevation: 5,
                    color: Colors.black
                }}
                autoCapitalize="none"
                onChangeText={(val) =>
                    onChange("phone", val)
                }
            />
        </View>
    )
}