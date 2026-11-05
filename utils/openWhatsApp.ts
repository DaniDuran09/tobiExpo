import { Linking } from "react-native";

export const openWhatsAppTobi = async (data?: any) => {
  // If backend provided an explicit direct URL or deep link:
  const directUrl = data?.whatsapp_url || data?.deep_link || data?.url || data?.link;
  if (directUrl && typeof directUrl === "string" && (directUrl.startsWith("http") || directUrl.startsWith("whatsapp:"))) {
    try {
      const canOpen = await Linking.canOpenURL(directUrl);
      if (canOpen) {
        await Linking.openURL(directUrl);
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
