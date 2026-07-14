export const ThemeMapping = {
  red: {
    fill: "#FFF2F2", // Fondo clarito
    stroke: "#FCA5A5", // Borde suave
    cta: "#EF4444", // Rojo fuerte para iconos/botones
  },
  yellow: {
    fill: "#FFFBEB",
    stroke: "#FDE047",
    cta: "#F59E0B",
  },
  green: {
    fill: "#F0FDF4",
    stroke: "#86EFAC",
    cta: "#22C55E",
  },
  blue: {
    fill: "#EFF6FF",
    stroke: "#93C5FD",
    cta: "#3B82F6",
  },
};

export const getThemeForCard = (card: any) => {
  const { priority, type, color_level } = card;
  if (type === "scheme_completed" || type === "appointment_created" || color_level === "green") return ThemeMapping.green;
  if (priority === "critical" || color_level === "red") return ThemeMapping.red;
  if (priority === "high" || priority === "medium" || color_level === "yellow") return ThemeMapping.yellow;
  if (priority === "low" || color_level === "blue") return ThemeMapping.blue;
  return ThemeMapping.blue; // default
};

export const getIconForType = (type: string) => {
  if (type.includes("vaccine") || type.includes("syringe")) return "medkit-outline";
  if (type.includes("deworming")) return "shield-checkmark-outline";
  if (type.includes("weight")) return "scale-outline";
  if (type.includes("appointment") || type.includes("date")) return "calendar-outline";
  if (type.includes("visit") || type.includes("summary")) return "document-text-outline";
  if (type.includes("recommendation")) return "list-outline";
  if (type.includes("scheme")) return "checkmark-circle-outline";
  return "notifications-outline"; // hourglass? maybe time-outline
};
