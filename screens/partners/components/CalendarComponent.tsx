import React from "react";
import { ScrollView } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { Colors } from "../../../styles/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  onLoadMore?: () => void;
  onLoadPrev?: () => void;
  canGoPrev?: boolean;
  onCancel?: () => void;
}

const CalendarComponent = ({
  agenda,
  selectedSlot,
  onSelect,
  onLoadMore,
  onLoadPrev,
  canGoPrev = false,
  onCancel,
}: Props) => {
  const days = Object.entries(agenda);
  const hasAnySlot = days.some(([, info]) => (info.available?.length ?? 0) > 0);

  return (
    <View>
      {/* ── Paginador ── */}
      <View row spread centerV paddingH-8 marginB-4>
        <TouchableOpacity
          onPress={onLoadPrev}
          disabled={!canGoPrev}
          style={{ opacity: canGoPrev ? 1 : 0.3, padding: 8 }}
        >
          <Icon name="chevron-left" size={28} color={Colors.primaryColor} />
        </TouchableOpacity>

        <Text text80BO>Selecciona fecha y hora</Text>

        <TouchableOpacity
          onPress={onLoadMore}
          style={{ padding: 8 }}
        >
          <Icon name="chevron-right" size={28} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>

      {/* ── Sin disponibilidad ── */}
      {days.length === 0 || !hasAnySlot ? (
        <View center padding-24 style={{ gap: 16 }}>
          <Icon name="calendar-remove-outline" size={52} color="#BBBBBB" />
          <Text text70 color="#888" style={{ textAlign: "center" }}>
            No hay horarios disponibles en estas fechas.{"\n"}Intenta avanzar o regresar.
          </Text>
          {onCancel && (
            <TouchableOpacity
              onPress={onCancel}
              style={{
                borderWidth: 1.5,
                borderColor: Colors.primaryColor,
                borderRadius: 100,
                paddingHorizontal: 32,
                paddingVertical: 10,
                marginTop: 8,
              }}
            >
              <Text style={{ color: Colors.primaryColor }} text70>
                Cancelar selección
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View row padding-8>
            {days.map(([date, info]) => {
              const slots = buildSlots(info.available, info.blocked);
              const header = formatDayHeader(date);

              return (
                <View key={date} width={90} marginR-12>
                  <View center marginB-12>
                    <Text text80BO>{header.day}</Text>
                    <Text text90 color="#888">{header.date}</Text>
                  </View>

                  {slots.length === 0 ? (
                    <Text text90 color="#CCC" style={{ textAlign: "center" }}>
                      Sin turnos
                    </Text>
                  ) : (
                    slots.map(slot => {
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
                              backgroundColor: isSelected ? "#007AFF" : "#D8EEFF",
                              borderWidth: isSelected ? 2 : 0,
                              borderColor: "#007AFF",
                            }}
                          >
                            <Text style={{ color: isSelected ? "#FFF" : "#222" }}>
                              {slot.label}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default CalendarComponent;
