import { ActivityIndicator, FlatList, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Text, View } from "react-native-ui-lib";
import { Calendar, CalendarUtils } from "react-native-calendars";
import { Colors } from "../../styles/Colors";
import momentTZ from "../../utils/moment";
import ApiFetcher from "../../modules/ApiFetcher";
import Toast from "react-native-toast-message";

const CustomCalendar = ({
  showCalendar = true,
  closeModal = () => { },
  setInfoDate,
  infoDate,
  availabilityDays = [],
  selectedServices = [],
  specialistId = 0,
}) => {

  const apiFetcher = new ApiFetcher();

  const [showSchedule, setShowSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [date, setDate] = useState(today);

  const today = CalendarUtils.getCalendarDateString(new Date());

  const groupedSchedule = [];
  for (let i = 0; i < slots.length; i += 2) {
    groupedSchedule.push(slots.slice(i, i + 2));
  }

  const unavailableDatesToMark = availabilityDays.reduce((acc, day) => {
    if (!day.available) {
      acc[day.date] = {
        disabled: true,
        disableTouchEvent: true,
      };
    }
    return acc;
  }, {});

  const datesToCalendar = {
    ...unavailableDatesToMark,
    [today]: { marked: true },
    [date]: {
      selected: true,
      marked: true,
      selectedColor: Colors.primaryColor,
    },
  };

  const onDayPress = (day) => {
    if (!unavailableDatesToMark[day.dateString]) {
      setDate(day.dateString);
    }
  };

  const getSlots = async () => {
    setLoading(true)
    try {
      const response = await apiFetcher.getAvailabilitySlotsByServices(
        specialistId,
        date,
        selectedServices
      );
      console.log("Response: ", response);
      if (response.available_slots.length > 0) {
        setSlots(response.available_slots);
        setShowSchedule(true);
      } else {
        Toast.show({
          type: "error",
          text1: "No hay horarios disponibles",
          text2: `Inténtalo de nuevo con otro día disponible`,
        });
        closeModal();
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false)
    }
  };



  const onHourPress = (slot) => {
    setSelectedHour(slot.start_time);
  };

  const renderScheduleRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((slot) => {
        const isSelected = selectedHour === slot.start_time;

        return (
          <TouchableOpacity
            key={slot.start_time}
            onPress={() => onHourPress(slot)}
            style={[styles.hourButton, isSelected && styles.selectedHour]}
          >
            <Text center margin-5>
              {`${slot.start_time} - ${slot.end_time}`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal
      transparent={true}
      visible={showCalendar}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View padding-20>
          {!showSchedule ? (
            <Calendar
              enableSwipeMonths={false}
              hideArrows={true}
              current={today}
              minDate={today}
              onDayPress={onDayPress}
              markedDates={datesToCalendar}
              style={styles.calendar}
              theme={{
                todayTextColor: Colors.primaryColor,
                selectedDayBackgroundColor: Colors.primaryColor,
                arrowColor: Colors.primaryColor,
                monthTextColor: Colors.primaryColor,
                textDayFontFamily: "System",
                textMonthFontFamily: "System",
                textDayHeaderFontFamily: "System",
                textDayFontWeight: "500",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "500",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          ) : (
            <View backgroundColor={Colors.white} br30 paddingV-10 center>
              <Text text80BO>
                {momentTZ(date)
                  .format("dddd D [de] MMMM")
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </Text>
              <FlatList
                data={groupedSchedule}
                renderItem={renderScheduleRow}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              />
            </View>
          )}
        </View>
        <View row spread paddingH-50>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              showSchedule ? setShowSchedule(false) : closeModal();
            }}
          >
            <Text text70BO>{showSchedule ? "Atrás" : "Cancelar"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            style={styles.acceptButton}
            onPress={() => {
              if (showSchedule) {
                setInfoDate({
                  ...infoDate,
                  time: `${selectedHour} - ${slots.find((slot) => slot.start_time === selectedHour)
                    ?.end_time
                    }`,
                });
                closeModal();
                setShowSchedule(false);
              } else {
                setInfoDate({ ...infoDate, date: date });
                getSlots();
              }
            }}
          >
            {!loading ?
              <Text text70BO color={Colors.white}>
                {showSchedule ? "Aceptar" : "Seleccionar"}
              </Text>
              :
              <ActivityIndicator size="small" color={Colors.white} />
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  acceptButton: {
    width: 150,
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    width: 150,
    backgroundColor: Colors.white,
    borderWidth: 1,
    padding: 15,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginVertical: 5,
  },
  hourButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightBlue,
    padding: 5,
    margin: 5,
    alignItems: "center",
    width: 130,
  },
  unavailableHour: {
    backgroundColor: "transparent",
  },
  unavailableText: {
    textDecorationLine: "line-through",
    color: Colors.grey,
  },
  selectedHour: {
    backgroundColor: Colors.secondaryColor,
  },
});
