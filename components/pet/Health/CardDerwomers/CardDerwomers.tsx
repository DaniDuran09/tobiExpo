import {
  View,
  Text,
  TouchableOpacity,
  DateTimePicker,
  Picker,
  Colors as ColorsUI,
  Hint,
} from "react-native-ui-lib";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { Colors } from "../../../../styles/Colors";
import momentTZ from "../../../../utils/moment";
import Button from "../../../atoms/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CalendarIcon from "../../../../assets/svg/calendar-icon.svg";
import Toast from "react-native-toast-message";
import { useSaveVaccineMutation } from "../../../../services/api/health.api";

const CardDerwomers: React.FC<CardDerwomersProps> = ({
  idPet,
  vaccineBrands,
  item,
  setIdEditPet,
  idEditPet,
  refreshData,
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [labelDate, setLabelDate] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [saveVaccine, { isLoading }] = useSaveVaccineMutation();

  const formattedBrands = vaccineBrands.map((brand) => ({
    label: brand,
    value: brand,
  }));

  useEffect(() => {
    if (idEditPet === item.id && date) {
      setLabelDate(momentTZ(date).format("DD.MM.YYYY"));
    } else {
      setLabelDate(
        item.application_day
          ? momentTZ(item.application_day).format("DD.MM.YYYY")
          : ""
      );
    }
  }, [idEditPet, date, item.application_day]);

  const cancelEdit = () => {
    setIdEditPet(null);
    setDate(null);
    setSelectedBrand("");
  };

  const handleSaveVaccine = async () => {
    if (!idEditPet || !date || !selectedBrand) {
      return;
    }
    try {
      const data = {
        pet_id: idPet,
        vaccine_id: item.id,
        application_day: momentTZ(date).format("DD/MM/YYYY"),
        dose: 0,
        applied: true,
        brand: selectedBrand,
        applied_by: "",
      };

      await saveVaccine(data).unwrap();
      setIdEditPet(null);
      refreshData();
    } catch (error) {
      console.log("error: ", error);
      Toast.show({
        type: "error",
        text1: "Error al guardar la vacuna",
        text2: "Por favor, intenta nuevamente",
      });
    }
  };

  return (
    <View
      width={Dimensions.get("window").width * 0.86}
      gap-15
      br40
      padding-15
      backgroundColor={Colors.lightBlue}
      spread
      marginR-10
      marginB-10
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View row spread>
        <View width="80%">
          <Text text70BO numberOfLines={2} adjustsFontSizeToFit>
            {item.name}
          </Text>
          <Text text90L numberOfLines={1} adjustsFontSizeToFit>
            {item.description}
          </Text>
        </View>
        {!item.applied && (
          <>
            {(!item.application_day && !item.brand) ? null : (
              <Hint
                position="top"
                visible={showHint}
                message={
                  item.application_day && !item.brand
                    ? "El registro está casi listo (falta marca)"
                    : !item.application_day && item.brand
                      ? "El registro está casi listo (falta fecha)"
                      : "¡Ups! Parece que esta vacuna no está registrada"
                }
                color={"#F5F5F5"}
                onBackgroundPress={() => setShowHint(false)}
                messageStyle={{
                  color: Colors.black,
                  fontSize: 14,
                }}
              >
                <TouchableOpacity onPress={() => setShowHint(true)}>
                  <Icon name="information-outline" size={20} color={Colors.red} />
                </TouchableOpacity>
              </Hint>
            )}
          </>
        )}
      </View>
      <View row spread>
        <Text text70>Fecha de Aplicación: </Text>
        <View centerV>
          <View>
            <DateTimePicker
              minimumDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              }
              maximumDate={new Date()}
              editable={idEditPet === item.id}
              display="spinner"
              mode={"date"}
              onChange={(selectedDate) => {
                setDate(selectedDate);
              }}
              children={
                <View>
                  {!item.application_day && !date ? (
                    <CalendarIcon />
                  ) : (
                    <Text text70BL>{labelDate}</Text>
                  )}
                </View>
              }
            />
          </View>
        </View>
      </View>
      <View row spread>
        <Text text70>Marca: </Text>
        <Picker
          editable={idEditPet === item.id}
          style={
            !item.applied && !selectedBrand
              ? {
                backgroundColor: Colors.white,
                padding: 25,
                height: 30,
                borderRadius: 2,
              }
              : { color: ColorsUI.blue20, fontWeight: "bold", fontSize: 16 }
          }
          placeholder={"Elegir"}
          value={selectedBrand || item.brand}
          onChange={(value) => setSelectedBrand(value as string)}
          items={formattedBrands}
        />
      </View>
      <View row spread>
        <Text text70>Vence: </Text>
        <Text text70BL color={item.applied ? Colors.green : Colors.gray}>
          {item.applied ? momentTZ(item.next_dose).format("DD.MM.YYYY") : ""}
        </Text>
      </View>
      {idEditPet === item.id && (
        <View row spread>
          {isLoading ? (
            <View flex center>
              <ActivityIndicator size="small" color={Colors.primaryColor} />
            </View>
          ) : (
            <>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={cancelEdit}
                disabled={isLoading}
              />
              <Button
                label="Confirmar"
                disabled={!date || !selectedBrand}
                variant="primary"
                bgColor={Colors.primaryColor}
                onPress={handleSaveVaccine}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default CardDerwomers;
