import { FlatList, Modal, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Text, View } from "react-native-ui-lib";
import { Calendar, CalendarUtils } from "react-native-calendars";
import { Colors } from "../../styles/Colors";
import momentTZ from "../../utils/moment";

const CustomCalendar = ({ showCalendar = true, closeModal = () => { }, setInfoDate, infoDate }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);

  const unavailableDates = ["2024-11-14", "2024-11-12"];
  const unavailableHours = ["9:00", "12:00", "16:00"];
  const today = CalendarUtils.getCalendarDateString(new Date());
  const schedule = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const [date, setDate] = useState(today);

  const groupedSchedule = [];
  for (let i = 0; i < schedule.length; i += 4) {
    groupedSchedule.push(schedule.slice(i, i + 4));
  }

  const unavailableDatesToMark = unavailableDates.reduce((acc, date) => {
    acc[date] = {
      disabled: true,
      disableTouchEvent: true,
      dotColor: "red",
      color: "red",
    };
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
    if (!unavailableDates.includes(day.dateString)) {
      setDate(day.dateString);
    }
  };

  const onHourPress = (hour) => {
    if (!unavailableHours.includes(hour)) {
      setSelectedHour(hour);
    }
  };

  const renderScheduleRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((hour) => {
        const isUnavailable = unavailableHours.includes(hour);
        const isSelected = selectedHour === hour;

        return (
          <TouchableOpacity
            key={hour}
            onPress={() => onHourPress(hour)}
            style={[
              styles.hourButton,
              isUnavailable && styles.unavailableHour,
              isSelected && styles.selectedHour,
            ]}
            disabled={isUnavailable}
          >
            <Text
              center
              margin-5
              style={isUnavailable ? styles.unavailableText : null}
            >
              {hour}
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
              enableSwipeMonths
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
            style={styles.acceptButton}
            onPress={() => {
              if (showSchedule) {
                setInfoDate({ ...infoDate, time: selectedHour })
                closeModal();
                setShowSchedule(false)
                console.log(selectedHour)
              } else {
                setInfoDate({ ...infoDate, date: date });
                setShowSchedule(true);
                console.log(date)
              }
            }}
          >
            <Text text70BO color={Colors.white}>
              {showSchedule ? "Aceptar" : "Seleccionar"}
            </Text>
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
    width: 80,
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
