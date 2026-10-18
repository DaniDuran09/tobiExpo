import { navigate } from "../hooks/navigationRef";
import ApiFetcher from "../modules/ApiFetcher";
import { openWhatsAppTobi } from "./openWhatsApp";

const apiFetcher = new ApiFetcher();

export const handleGlobalAction = async (action: string, data: any, id?: string | number, type?: string) => {
  console.log("Global Action triggered:", action, data, id);

  if (id) {
    try {
      await apiFetcher.markHomeCardAsRead(id, type);
    } catch (e) {
      console.warn("Failed to mark card as read", e);
    }
  }

  const serviceName =
    data?.service_catalog?.name ||
    data?.service_name ||
    data?.vaccine_name ||
    data?.vaccine?.name ||
    data?.deworming_name ||
    data?.name ||
    null;

  const actionKey = action || type || "";
  let petTargetId = data?.pet_id ?? data?.idSelectedPet ?? data?.id ?? null;

  if (!petTargetId) {
    try {
      const petsResponse = await apiFetcher.getPets();
      if (petsResponse?.data && petsResponse.data.length > 0) {
        petTargetId = petsResponse.data[0].id;
      }
    } catch (e) {
      console.warn("No se pudo obtener la mascota por defecto:", e);
    }
  }

  // Detección directa de Comunicación 004 (Trigger 004: Perfil creado -> Completar esquema)
  const isCommunication004 =
    actionKey === "004" ||
    actionKey === "trigger_004" ||
    actionKey === "communication_004" ||
    actionKey === "complete_scheme" ||
    actionKey === "completar_esquema" ||
    actionKey === "continuar_esquema" ||
    data?.trigger === "004" ||
    data?.trigger_id === "004" ||
    data?.trigger_id === 4 ||
    data?.communication === "004" ||
    data?.communication_id === "004" ||
    data?.communication_id === 4 ||
    type === "004" ||
    type === "trigger_004" ||
    type === "communication_004" ||
    (typeof data?.title === "string" && data.title.toLowerCase().includes("perfil creado")) ||
    (typeof data?.body === "string" && data.body.toLowerCase().includes("completemos su esquema"));

  const isSchemeTrigger =
    actionKey === "scheme_started" ||
    actionKey === "scheme_incomplete" ||
    actionKey === "pet_created" ||
    type === "scheme_started" ||
    type === "scheme_incomplete" ||
    type === "pet_created" ||
    data?.trigger === "scheme_started" ||
    data?.trigger === "scheme_incomplete" ||
    data?.trigger === "pet_created" ||
    (typeof id === "string" && (id.includes("scheme_started") || id.includes("scheme_incomplete") || id.includes("pet_created")));

  if (isCommunication004 || isSchemeTrigger) {
    navigate("HomeProfileDetails", { idSelectedPet: petTargetId });
    return;
  }

  switch (actionKey) {
    case "view_home":
    case "view_plan":
    case "preventive_plan_generated":
      navigate("Home");
      break;

    case "appointment_created":
    case "view_appointment":
    case "upcoming_appointment":
    case "appointment_24h":
    case "appointment_2h":
    case "no_checkin_detected":
    case "visit_completed":
    case "view_summary":
    case "summary_unopened":
      if (actionKey === "view_summary" || actionKey === "summary_unopened") {
        if (data?.visit_summary_id) {
          apiFetcher.markVisitSummaryOpened(data.visit_summary_id).catch(e => console.warn(e));
        }
      }
      if (data?.visit_id) {
        navigate("Health", { screen: "VisitDetails", params: { id: data.visit_id } });
      } else {
        navigate("Health", { screen: "AppointmentsHome" });
      }
      break;

    case "view_vaccines":
    case "view_deworming":
    case "vaccine_due":
    case "vaccine_expired":
    case "vaccine_due_7d":
    case "vaccine_due_1d":
    case "vaccine_expired_7d":
    case "vaccine_expired_21d":
    case "deworming_due":
    case "deworming_expired":
    case "deworming_due_7d":
    case "deworming_due_1d":
    case "deworming_expired_7d":
    case "deworming_expired_21d":
    case "weight_low":
    case "weight_high":
    case "no_booking":
    case "follow_up_recommended":
    case "follow_up_due":
    case "follow_up_overdue":
    case "clinical_recommendation":
    case "book_consultation":
    case "book_appointment":
      if (data?.partner_id) {
        navigate("Explore", {
          screen: "PartnersGeneralInfo",
          params: { partner_id: data.partner_id },
        });
      } else {
        const catalogCode = actionKey === "no_booking" ? "SC-CONSULTA-GENERAL" : null;
        navigate("Explore", {
          screen: "SelectService",
          params: {
            q: serviceName,
            petId: petTargetId,
            serviceId: null,
            vaccine_id: data?.vaccine_id ?? null,
            catalog_code: catalogCode,
            service_catalog_id: data?.service_catalog_id ?? null,
          },
        });
      }
      break;

    case "weight_out_of_range":
    case "weight_out_of_range_3d":
    case "weight_out_of_range_7d":
    case "weight_out_of_range_21d":
    case "weight_recorded":
    case "view_weight_detail":
    case "complete_profile":
      if (typeof id === "string" && id.includes("scheme_incomplete")) {
        navigate("HomeProfileDetails", { idSelectedPet: petTargetId });
        break;
      }
      if (data?.pet_id) {
        try {
          const petResponse = await apiFetcher.getPetById(data.pet_id);
          if (petResponse?.data) {
            navigate("ProfileStack", { screen: "PetProfile", params: { item: petResponse.data } });
          }
        } catch (error) {
          console.error("Error fetching pet for navigation:", error);
        }
      }
      break;

    case "view_recommendation":
      navigate("HomeProfileDetails", { idSelectedPet: data?.pet_id });
      break;

    case "edit_profile":
      navigate("ProfileStack", { screen: "ProfileEditUser" });
      break;

    case "add_pet":
    case "no_pet":
    case "no_pet_created":
    case "onboarding_abandoned":
      try {
        const appStorage = new (require("../modules/AppStorage").default)();
        const token = await appStorage.getAppToken();
        if (token) {
          navigate("RegisterNewPet", { returnTo: "HomeScreen" });
        } else {
          // If no session, navigate to AuthStack -> UserStepsRegister
          // Note: If you are at AuthStack root, you might need to navigate directly
          navigate("UserStepsRegister", { email: data?.email || "" });
        }
      } catch (e) {
        navigate("RegisterNewPet", { returnTo: "HomeScreen" });
      }
      break;

    case "pet_created":
    case "scheme_incomplete":
    case "scheme_started":
    case "complete_scheme":
    case "completar_esquema":
    case "continuar_esquema":
    case "view_scheme":
    case "view_health_record":
      navigate("HomeProfileDetails", { idSelectedPet: petTargetId });
      break;

    case "scheme_completed":
      navigate("PetVaccinesRecord", { id: petTargetId });
      break;

    case "view_pet_profile":
      navigate("HomeProfileDetails", { idSelectedPet: petTargetId });
      break;

    case "preventive_due_no_booking":
    case "view_care_center":
    case "multiple_active_states":
    case "user_inactive_30d":
    case "user_inactive_7d":
      navigate("Health", { screen: "CareCenter" });
      break;

    case "no_show":
    case "appointment_no_show":
    case "no_se_presento":
    case "reagendar":
    case "reagendar_cita":
    case "contact_tobi":
    case "whatsapp":
      await openWhatsAppTobi(data);
      break;

    default:
      if (
        actionKey.includes("no_show") ||
        actionKey.includes("no_se_presento") ||
        (type && (type.includes("no_show") || type.includes("no_se_presento"))) ||
        data?.appointment_status === "no_show" ||
        data?.status === "no_show"
      ) {
        await openWhatsAppTobi(data);
        break;
      }
      if (data?.whatsapp_url || data?.deep_link?.includes("wa.me") || data?.deep_link?.includes("whatsapp")) {
        await openWhatsAppTobi(data);
        break;
      }
      console.warn("No global action mapped for", actionKey);
      break;
  }
};
