import Toast from "react-native-toast-message";
import AppStorage from "../modules/AppStorage";
import { store } from "../redux/store";
import { clearUser } from "../redux/slice/userSlice";
import { clearPetInfo } from "../redux/slice/petSlice";
import { clearAppointments } from "../redux/slice/appointmentSlice";
import { petsApi } from "../services/api/pets.api";
import { userApi } from "../services/api/user.api";
import { healthApi } from "../services/api/health.api";
import { resetToLogin } from "../hooks/navigationRef";

let isLoggingOut = false;

/**
 * Endpoints públicos o de autenticación inicial que no deben provocar
 * un logout automático si fallan por credenciales incorrectas.
 */
const EXCLUDED_URL_PATTERNS = [
  "/auth/login",
  "/registers/send_verification_email",
  "/registers/verify_email",
  "/registers",
  "/onboarding_sessions",
  "/forgot_password",
];

export function isSessionInvalidStatus(
  status?: number,
  data?: any,
  url?: string
): boolean {
  if (url) {
    const isExcluded = EXCLUDED_URL_PATTERNS.some((pattern) =>
      url.includes(pattern)
    );
    if (isExcluded) {
      return false;
    }
  }

  // 401 Unauthorized o 403 Forbidden
  if (status === 401 || status === 403) {
    return true;
  }

  // 400 Bad Request que contenga user.make_login o user.not_found
  if (status === 400) {
    if (data) {
      if (
        data.message === "user.make_login" ||
        data.message === "user.not_found" ||
        data.error === "user.make_login" ||
        data.error === "user.not_found"
      ) {
        return true;
      }
      if (Array.isArray(data.errors)) {
        if (
          data.errors.includes("user.make_login") ||
          data.errors.includes("user.not_found")
        ) {
          return true;
        }
      }
      try {
        const rawString = typeof data === "string" ? data : JSON.stringify(data);
        if (
          rawString.includes("user.make_login") ||
          rawString.includes("user.not_found")
        ) {
          return true;
        }
      } catch (e) {
        // Ignorar error de parsing
      }
    }
  }

  // 404 en el endpoint de perfil indica que el usuario no existe (cuenta borrada)
  if (status === 404) {
    if (url && (url.includes("/portal_client/profile") || url.includes("/users/"))) {
      return true;
    }
    if (data) {
      try {
        const rawString = typeof data === "string" ? data : JSON.stringify(data);
        if (
          rawString.includes("user.not_found") ||
          rawString.toLowerCase().includes("usuario no encontrado")
        ) {
          return true;
        }
      } catch (e) {
        // Ignorar error de parsing
      }
    }
  }

  return false;
}

export function isSessionInvalidResponse(response: any): boolean {
  if (!response) return false;
  const status = response.status || response.data?.code;
  const data = response.data;
  const url = response.config?.url;
  return isSessionInvalidStatus(status, data, url);
}

export function isSessionInvalidError(error: any): boolean {
  if (!error) return false;
  if (error.isSessionInvalid) return true;

  const response = error.response;
  if (response) {
    const status = response.status || response.data?.code;
    const data = response.data;
    const url = error.config?.url || response.config?.url;
    if (isSessionInvalidStatus(status, data, url)) {
      return true;
    }
  }

  if (typeof error.message === "string") {
    if (
      error.message.includes("user.make_login") ||
      error.message.includes("user.not_found")
    ) {
      return true;
    }
  }

  return false;
}

export async function handleAutomaticLogout(options?: {
  message?: string;
}): Promise<void> {
  if (isLoggingOut) {
    return;
  }
  isLoggingOut = true;
  console.log("🔒 [AuthSession] Iniciando cierre de sesión automático...");

  try {
    // 1. Limpiar almacenamiento local (conservando hasSeenOnboarding)
    const appStorage = new AppStorage();
    await appStorage.clearStorage();

    // 2. Limpiar estado en Redux
    store.dispatch(clearUser());
    store.dispatch(clearPetInfo());
    store.dispatch(clearAppointments());

    // 3. Limpiar caché de RTK Query
    if (petsApi?.util?.resetApiState) {
      store.dispatch(petsApi.util.resetApiState());
    }
    if (userApi?.util?.resetApiState) {
      store.dispatch(userApi.util.resetApiState());
    }
    if (healthApi?.util?.resetApiState) {
      store.dispatch(healthApi.util.resetApiState());
    }

    // 4. Mostrar mensaje al usuario
    Toast.show({
      type: "error",
      text1: "Sesión cerrada",
      text2:
        options?.message ||
        "Tu sesión no es válida o la cuenta ha sido eliminada.",
      visibilityTime: 4500,
    });

    // 5. Redirigir a LoginScreen
    resetToLogin();
  } catch (error) {
    console.error("❌ [AuthSession] Error durante el logout automático:", error);
    resetToLogin();
  } finally {
    // Liberar mutex después de 3 segundos
    setTimeout(() => {
      isLoggingOut = false;
    }, 3000);
  }
}
