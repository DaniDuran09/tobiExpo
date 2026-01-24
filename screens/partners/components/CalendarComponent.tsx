import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";


const HOURS = Array.from({ length: 20 }, (_, i) => {
  const h = Math.floor(i / 2) + 9;
  const m = i % 2 === 0 ? "00" : "30";
  return `${h.toString().padStart(2, "0")}:${m}`;
});

const getLabelFromRange = (range: string) => {
  const [start] = range.split("...");
  const [, time] = start.split(" ");
  const [h, m] = time.split(":");
  return Number(m) < 30 ? `${h}:00` : `${h}:30`;
};

const buildSlotMap = (ranges: string[] = []) => {
  const map: Record<
    string,
    { label: string; value: string }
  > = {};

  ranges.forEach(range => {
    const label = getLabelFromRange(range);
    map[label] = { label, value: range };
  });

  return map;
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

interface Props {
  agenda: Record<
    string,
    {
      available: string[];
      blocked?: string[];
    }
  >;
  onSelect?: (slot: {
    date: string;
    label: string;
    value: string;
  }) => void;
}

const CalendarComponent = ({ agenda, onSelect }: Props) => {
  const days = Object.entries(agenda);
  const [selected, setSelected] = useState<{
    date: string;
    label: string;
  } | null>(null);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View row padding-16>
        {days.map(([date, info]) => {
          const availableMap = buildSlotMap(info.available);
          const blockedMap = buildSlotMap(info.blocked || []);
          const header = formatDayHeader(date);

          return (
            <View key={date} width={90} marginR-12>
              <View center marginB-12>
                <Text text80BO>{header.day}</Text>
                <Text text90 color="#888">
                  {header.date}
                </Text>
              </View>

              {HOURS.map(hour => {
                const isAvailable = availableMap[hour];
                const isBlocked = blockedMap[hour];
                const isSelected =
                  selected?.date === date &&
                  selected?.label === hour;

                if (isBlocked) {
                  return (
                    <Text
                      key={hour}
                      marginV-8
                      style={{
                        textDecorationLine: "line-through",
                        color: "#AAA",
                        textAlign: "center",
                      }}
                    >
                      {hour}
                    </Text>
                  );
                }

                if (isAvailable) {
                  return (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => {
                        setSelected({ date, label: hour });
                        onSelect?.({
                          date,
                          label: hour,
                          value: isAvailable.value,
                        });
                      }}
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
                        <Text>{hour}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }

                return (
                  <Text
                    key={hour}
                    marginV-8
                    color="#CCC"
                    style={{ textAlign: "center" }}
                  >
                    —
                  </Text>
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
