import { navigate } from "../hooks/navigationRef";

/**
 * Tipos de origen de navegación.
 * Se pasa como route.params.source desde ActionHandler/NotificationContext.
 */
export type NavSource =
  | "Home"       // desde HomeScreen (banner / action card) o PendingCare del HomeStack
  | "CareCenter" // desde la tab Health (CareCenter / PendingCareScreen)
  | "AppointmentsHome" // desde Mis citas (ProfileStack)
  | "Push"       // notificación push (cold-start o foreground)
  | undefined;

/**
 * Navega de regreso al origen de la acción.
 *
 * @param source  Valor de route.params.source.
 * @param navigationRef  Objeto navigation local del componente (necesario para goBack).
 */
export const navigateBack = (source: NavSource, navigation: any) => {
  if (navigation?.setParams) {
    try {
      navigation.setParams({ source: undefined });
    } catch {}
  }

  if (source === "CareCenter") {
    navigate("Health", { screen: "CareCenter" } as never);
    return;
  }
  if (source === "AppointmentsHome") {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigate("ProfileStack", { screen: "AppointmentsHome" } as never);
    }
    return;
  }
  if (source === "Home" || source === "Push") {
    navigate("HomeStack", { screen: "HomeScreen" } as never);
    return;
  }
  // Fallback si no hay source definido o es navegación estándar
  if (navigation?.canGoBack && navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigate("HomeStack", { screen: "HomeScreen" } as never);
  }
};

