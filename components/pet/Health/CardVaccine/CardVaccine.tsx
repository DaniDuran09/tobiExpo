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
import {
  useSaveDewormerMutation,
  useSaveVaccineMutation,
  useUpdateVaccineMutation,
  useUpdateDewormerMutation,
} from "../../../../services/api/health.api";

const CardVaccine: React.FC<CardVaccineProps> = ({
  idPet,
  vaccineBrands,
  item,
  setIdEditPet,
  idEditPet,
  refreshData = () => { },
  type,
  dewormersFrequency = [],
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [labelDate, setLabelDate] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);

  const [saveVaccine, { isLoading }] = useSaveVaccineMutation();
  const [updateVaccine] = useUpdateVaccineMutation();
  const [saveDewormer, { isLoading: isLoadingDewormer }] = useSaveDewormerMutation();
  const [updateDewormer] = useUpdateDewormerMutation();

  const frequencies = dewormersFrequency.length > 0
    ? dewormersFrequency.map(f => ({ label: f.text, value: f.text }))
    : [
      { label: "Semestral", value: "Semestral" },
      { label: "Trimestral", value: "Trimestral" },
      { label: "Mensual", value: "Mensual" },
    ];

  const formattedBrands = vaccineBrands?.map((brand) => ({
    label: brand,
    value: brand,
  }));

  const computedFrequencyValue = selectedFrequency || item.deworming_frequency;

  const isEditable = idEditPet === (item.uid || item.id);

  useEffect(() => {
    if (isEditable) {
      if (!selectedBrand) {
        setSelectedBrand(item.brand || "");
      }

      if (type === "derwomers" && !selectedFrequency) {
        setSelectedFrequency(item.deworming_frequency || "");
      }

      if (!date && item.application_day) {
        const parsedMoment = momentTZ(item.application_day, ["YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY", "YYYY/MM/DD"]);
        const formatted = parsedMoment.isValid() ? parsedMoment.format("DD.MM.YYYY") : "";
        setDate(parsedMoment.isValid() ? parsedMoment.toDate() : new Date());
        setLabelDate(formatted);
      }
    } else {
      let formatted = "";
      if (item.application_day) {
        const parsed = momentTZ(item.application_day, ["YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY", "YYYY/MM/DD"]);
        formatted = parsed.isValid() ? parsed.format("DD.MM.YYYY") : "";
      }
      setLabelDate(formatted);
    }
  }, [isEditable]);


  const cancelEdit = () => {
    setIdEditPet(null);
    setDate(null);
    setSelectedBrand("");
    setSelectedFrequency("");
  };

  const handleSave = async () => {
    if (!idEditPet || !date || !selectedBrand) return;

    try {
      const formattedDate = momentTZ(date).format("DD/MM/YYYY");

      if (type === "vaccines") {
        const data = {
          pet_id: idPet,
          record_id: item.vaccination_record_id || item.id,
          application_day: formattedDate,
          brand: selectedBrand,
        };
        if (item.vaccination_record_id || item.applied || item.application_day) {
          console.log("UPDATING VACCINE WITH PAYLOAD:", data);
          let response = await updateVaccine(data).unwrap();
          console.log("UPDATE VACCINE RESP:", response);
        } else {
          const payload = {
            ...data,
            dose: 0,
            applied: true,
            applied_by: "",
            vaccine_id: item.vaccine_id || item.id,
          };
          console.log("SAVING VACCINE WITH PAYLOAD:", payload);
          let debugRes = await saveVaccine(payload).unwrap();
          console.log("SAVE VACCINE RESP:", debugRes);
        }
      } else {
        const data = {
          pet_id: idPet,
          record_id: item.deworming_record_id || item.vaccination_record_id || item.id,
          application_day: formattedDate,
          brand: selectedBrand,
          deworming_type: item.deworming_type_toRegister,
          deworming_frequency: selectedFrequency,
          last_deworming: formattedDate,
        };
        if (item.deworming_record_id || item.vaccination_record_id || item.applied || item.application_day) {
          console.log("UPDATING DEWORMER WITH PAYLOAD:", data);
          let response = await updateDewormer(data).unwrap();
          console.log("UPDATE DEWORMER RESP:", response);
        } else {
          const payload = {
            ...data,
            applied: true,
            dose: 0,
            vaccine_id: item.vaccine_id || item.id,
          };
          console.log("SAVING DEWORMER WITH PAYLOAD:", payload);
          let debugResDewormer = await saveDewormer(payload).unwrap();
          console.log("SAVE DEWORMER RESP:", debugResDewormer);
        }
      }

      Toast.show({
        type: "success",
        text1: `${type === "vaccines" ? "Vacuna" : "Desparasitación"} guardada correctamente`,
      });

      setIdEditPet(null);
      refreshData();
    } catch (error) {
      console.log("Error completo: ", JSON.stringify(error, null, 2));
      Toast.show({
        type: "error",
        text1: "Error al guardar la vacuna",
        text2: "Por favor, intenta nuevamente",
      });
    }
  };

  let venceColor: any = Colors.gray;
  if (item.days_remaining !== undefined) {
    if (item.days_remaining > 50) {
      venceColor = Colors.black;
    } else if (item.days_remaining >= 31) {
      venceColor = Colors.green;
    } else if (item.days_remaining >= 1) {
      venceColor = "#F5A623";
    } else {
      venceColor = Colors.red;
    }
  }

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
            {type === "vaccines"
              ? item.name
              : item.applied
                ? `Desparasitación ${item?.deworming_type}`
                : item.description}
          </Text>
          {type === "vaccines" && (
            <Text text90L numberOfLines={1} adjustsFontSizeToFit>
              {item.description}
            </Text>
          )}
        </View>
        {(item.applied || item.application_day) && !isEditable && (
          <TouchableOpacity onPress={() => setIdEditPet(item.uid || item.id)}>
            <Icon name="pencil-outline" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {type === "derwomers" && (
        <View row spread>
          <Text text70>Frecuencia: </Text>
          <Picker
            editable={isEditable || (!item.applied && !item.application_day)}
            style={
              isEditable || (!item.applied && !item.application_day)
                ? {
                  backgroundColor: Colors.white,
                  padding: 25,
                  height: 30,
                  borderRadius: 2,
                }
                : { color: ColorsUI.blue20, fontWeight: "bold", fontSize: 16 }
            }
            placeholder={"Elegir"}
            value={computedFrequencyValue}
            onChange={(value) => setSelectedFrequency(value as string)}
            items={frequencies}
          />
        </View>
      )}

      <View row spread>
        <Text text70>Fecha de Aplicación: </Text>
        <View centerV>
          <DateTimePicker
            minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - (type === "vaccines" ? 2 : 1)))}
            maximumDate={new Date()}
            editable={isEditable || (!item.applied && !item.application_day)}
            display="spinner"
            mode={"date"}
            onChange={(selectedDate) => {
              setDate(selectedDate);
              setLabelDate(momentTZ(selectedDate).format("DD.MM.YYYY"));
              setIdEditPet(item.uid || item.id);
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

      <View row spread>
        <Text text70>Marca: </Text>
        <Picker
          editable={isEditable || (!item.applied && !item.application_day)}
          style={
            isEditable || (!item.applied && !item.application_day)
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
        <Text text70BL color={venceColor}>
          {(item.applied || item.application_day)
            ? item.next_dose
              ? (() => {
                const m = momentTZ(item.next_dose, ["YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY"]);
                return m.isValid() ? m.format("DD.MM.YYYY") : "Pendiente";
              })()
              : "Pendiente"
            : ""}
        </Text>
      </View>

      {isEditable || (!item.applied && !item.application_day) ? (
        <View row spread>
          {isLoading || isLoadingDewormer ? (
            <View flex center>
              <ActivityIndicator size="small" color={Colors.primaryColor} />
            </View>
          ) : (
            <>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={cancelEdit}
                disabled={isLoading || isLoadingDewormer}
              />
              <Button
                label="Confirmar"
                disabled={
                  (!date && type === "vaccines") ||
                  (!date && type === "derwomers") ||
                  (!selectedBrand && type === "vaccines") ||
                  (!selectedFrequency && type === "derwomers")
                }
                variant="primary"
                bgColor={Colors.primaryColor}
                onPress={handleSave}
              />
            </>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default CardVaccine;
