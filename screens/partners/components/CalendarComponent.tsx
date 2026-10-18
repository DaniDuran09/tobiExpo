import React from "react";
import { ScrollView, ActivityIndicator } from "react-native";
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
  isLoading?: boolean;
  calendarOffset?: number;
}

const CalendarComponent = ({
  agenda,
  selectedSlot,
  onSelect,
  onLoadMore,
  onLoadPrev,
  canGoPrev = false,
  onCancel,
  isLoading = false,
  calendarOffset = 0,
}: Props) => {
  // Calcular la fecha de inicio del bloque actual
  const today = new Date();
  const startDateObj = new Date(today);
  startDateObj.setDate(startDateObj.getDate() + calendarOffset);
  const startDateStr = startDateObj.toISOString().slice(0, 10);

  // Filtrar los días para que comiencen desde startDateStr y tomar solo los 3 primeros
  const allDays = Object.entries(agenda)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([dateStr]) => dateStr >= startDateStr);
    
  const days = allDays.slice(0, 3);
  const hasAnySlot = days.some(([, info]) => (info.available?.length ?? 0) > 0);

  return (
    <View style={{ minHeight: 150 }}>
      {/* ── Cargando Inicial (cuando aún no hay días) ── */}
      {isLoading && days.length === 0 ? (
        <View center padding-32>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
          <Text text80 color="#888" marginT-12>Cargando horarios...</Text>
        </View>
      ) : days.length === 0 || !hasAnySlot ? (
        <View center padding-24 style={{ gap: 16 }}>
          <View row spread centerV width="100%">
            {canGoPrev ? (
              <TouchableOpacity
                onPress={onLoadPrev}
                style={{ backgroundColor: "#D8EEFF", borderRadius: 15, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="chevron-left" size={20} color="#000" />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 30, height: 30 }} />
            )}

            <Icon name="calendar-remove-outline" size={52} color="#BBBBBB" />

            <TouchableOpacity
              onPress={onLoadMore}
              style={{ padding: 8, backgroundColor: "#D8EEFF", borderRadius: 15, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="chevron-right" size={20} color="#000" />
            </TouchableOpacity>
          </View>
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
        <View style={{ position: 'relative' }}>
          {/* Overlay de carga cuando ya hay días mostrándose */}
          {isLoading && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
          )}

          <View style={{ opacity: isLoading ? 0.3 : 1 }} pointerEvents={isLoading ? "none" : "auto"}>
            {/* Fila de encabezados de fechas con flechas */}
            <View row centerV spread marginB-10>
              {canGoPrev ? (
                <TouchableOpacity
                  onPress={onLoadPrev}
                  style={{ backgroundColor: "#D8EEFF", borderRadius: 15, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="chevron-left" size={18} color="#000" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 26, height: 26 }} />
              )}

              <View row flex spread paddingH-10>
                {days.map(([date]) => {
                  const header = formatDayHeader(date);
                  return (
                    <View key={`header-${date}`} flex center>
                      <Text text80 style={{ color: "#000", fontSize: 13 }}>{header.day}</Text>
                      <Text text90 color="#888" style={{ fontSize: 11 }}>{header.date}</Text>
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity
                onPress={onLoadMore}
                style={{ backgroundColor: "#D8EEFF", borderRadius: 15, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="chevron-right" size={18} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Fila de los slots */}
            <View row paddingH-36 spread>
              {days.map(([date, info]) => {
                const slots = buildSlots(info.available, info.blocked);

                return (
                  <View key={`slots-${date}`} flex centerH paddingH-4>
                    {slots.length === 0 ? (
                      <Text text90 color="#000" style={{ textAlign: "center", marginTop: 10 }}>
                        -
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
                                fontSize: 12
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
                            style={{ width: '100%', alignItems: 'center' }}
                          >
                            <View
                              height={32}
                              center
                              br-8
                              marginV-6
                              style={{
                                backgroundColor: isSelected ? "#FFF" : "#DDF1FF",
                                borderColor: isSelected ? Colors.red : "transparent",
                                borderWidth: isSelected ? 1 : 0,
                                width: '100%',
                                maxWidth: 70
                              }}
                            >
                              <Text style={{ color: "#222", fontWeight: isSelected ? "900" : "500", fontSize: 12 }}>
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
          </View>
        </View>
      )}
    </View>
  );
};

export default CalendarComponent;
