import React from "react";
import { ScrollView } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";

const getLabelFromRange = (range: string) => {
  const [start] = range.split("...");
  const [, time] = start.split(" ");
  const [h, m] = time.split(":");
  return `${h}:${m}`;
};

const formatDayHeader = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);

  return {
    day: d.toLocaleDateString("es-MX", { weekday: "short" }),
    date: d.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    }),
  };
};

const buildSlots = (available: string[] = [], blocked: string[] = []) => {
  const slots = [
    ...available.map(value => ({
      label: getLabelFromRange(value),
      value,
      status: "available" as const,
    })),
    ...blocked.map(value => ({
      label: getLabelFromRange(value),
      value,
      status: "blocked" as const,
    })),
  ];

  return slots.sort((a, b) => a.label.localeCompare(b.label));
};

interface Props {
  agenda: Record<string, { available: string[]; blocked?: string[] }>;
  selectedSlot: {
    date: string;
    value: string;
  } | null;
  onSelect: (slot: { date: string; label: string; value: string }) => void;
}

const CalendarComponent = ({ agenda, selectedSlot, onSelect }: Props) => {
  const days = Object.entries(agenda);

  if (days.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View row padding-16>
        {days.map(([date, info]) => {
          const slots = buildSlots(info.available, info.blocked);
          const header = formatDayHeader(date);

          return (
            <View key={date} width={90} marginR-12>
              <View center marginB-12>
                <Text text80BO>{header.day}</Text>
                <Text text90 color="#888">{header.date}</Text>
              </View>

              {slots.map(slot => {
                const isSelected =
                  selectedSlot?.date === date &&
                  selectedSlot?.value === slot.value;

                if (slot.status === "blocked") {
                  return (
                    <Text
                      key={`${date}-${slot.value}`}
                      marginV-8
                      style={{
                        textDecorationLine: "line-through",
                        color: "#AAA",
                        textAlign: "center",
                      }}
                    >
                      {slot.label}
                    </Text>
                  );
                }

                return (
                  <TouchableOpacity
                    key={`${date}-${slot.value}`}
                    onPress={() =>
                      onSelect({
                        date,
                        label: slot.label,
                        value: slot.value,
                      })
                    }
                  >
                    <View
                      height={36}
                      center
                      br-8
                      marginV-6
                      style={{
                        backgroundColor: "#D8EEFF",
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: "#007AFF",
                      }}
                    >
                      <Text>{slot.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default CalendarComponent;
