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
  const { priority, type, color_level, section } = card;
  if (section === "atencion_requerida") return ThemeMapping.red;
  if (section === "proximos_cuidados") return ThemeMapping.yellow;
  if (section === "seguimiento") return ThemeMapping.blue;

  const typeStr = (type || "").toLowerCase();
  const actionStr = (card.action || "").toLowerCase();
  const titleStr = (card.title || "").toLowerCase();
  if (
    typeStr.includes("no_show") ||
    typeStr.includes("no_se_presento") ||
    actionStr.includes("no_show") ||
    actionStr.includes("no_se_presento") ||
    card.status === "no_show" ||
    card.data?.status === "no_show" ||
    card.data?.appointment_status === "no_show" ||
    titleStr.includes("no se presentó") ||
    titleStr.includes("no se presento")
  ) {
    return ThemeMapping.red;
  }

  if (type === "scheme_completed" || type === "appointment_created" || color_level === "green") return ThemeMapping.green;
  if (priority === "critical" || color_level === "red") return ThemeMapping.red;
  if (priority === "high" || priority === "medium" || color_level === "yellow") return ThemeMapping.yellow;
  if (priority === "low" || color_level === "blue") return ThemeMapping.blue;
  return ThemeMapping.blue; // default
};

export const getIconForType = (type: string = "") => {
  const str = type.toLowerCase();
  if (str.includes("no_show") || str.includes("no_se_presento") || str.includes("no se presentó")) return "alert-circle-outline";
  if (str.includes("vaccine") || str.includes("syringe")) return "medkit-outline";
  if (str.includes("deworming")) return "shield-checkmark-outline";
  if (str.includes("weight")) return "scale-outline";
  if (str.includes("appointment") || str.includes("date")) return "calendar-outline";
  if (str.includes("visit") || str.includes("summary")) return "document-text-outline";
  if (str.includes("recommendation")) return "list-outline";
  if (str.includes("scheme")) return "checkmark-circle-outline";
  return "notifications-outline"; // hourglass? maybe time-outline
};
