import { Linking } from "react-native";

export const openWhatsAppTobi = async (data?: any) => {
  // Solo abrir URL directa si explícitamente es un enlace de WhatsApp
  const potentialUrl = data?.whatsapp_url || data?.deep_link || data?.url || data?.link;
  const isWhatsAppUrl =
    typeof potentialUrl === "string" &&
    (potentialUrl.startsWith("whatsapp:") ||
      potentialUrl.includes("wa.me") ||
      potentialUrl.includes("whatsapp.com") ||
      potentialUrl.includes("api.whatsapp.com"));

  if (isWhatsAppUrl) {
    try {
      const canOpen = await Linking.canOpenURL(potentialUrl);
      if (canOpen) {
        await Linking.openURL(potentialUrl);
        return;
      }
    } catch (e) {
      console.warn("Error abriendo directUrl de WhatsApp:", e);
    }
  }

  const petName = data?.pet_name || data?.pet?.name || data?.pet?.display_name || "";
  const defaultText = petName
    ? `Hola, quiero reagendar la cita de ${petName}`
    : "Hola, quiero reagendar mi cita";
  const message = data?.message || defaultText;
  const encodedText = encodeURIComponent(message);

  const TOBI_PHONE = "5215533321784"; // +52 1 55 3332 1784
  const phone = data?.phone || data?.whatsapp_phone || data?.tobi_phone || TOBI_PHONE;
  const phoneClean = phone ? String(phone).replace(/[^0-9]/g, "") : TOBI_PHONE;

  const appScheme = `whatsapp://send?phone=${phoneClean}&text=${encodedText}`;
  const webUrl = `https://wa.me/${phoneClean}?text=${encodedText}`;

  try {
    const supported = await Linking.canOpenURL(appScheme);
    if (supported) {
      await Linking.openURL(appScheme);
    } else {
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Linking.openURL(webUrl).catch((err) =>
      console.warn("Error al abrir WhatsApp:", err)
    );
  }
};

export default openWhatsAppTobi;
