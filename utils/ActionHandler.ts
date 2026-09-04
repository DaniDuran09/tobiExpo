import { navigate } from "../hooks/navigationRef";
import ApiFetcher from "../modules/ApiFetcher";

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

  switch (actionKey) {
    case "view_home":
      navigate("Home");
      break;

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
        navigate("Explore", {
          screen: "SelectService",
          params: {
            q: serviceName,
            petId: data?.pet_id ?? null,
            serviceId: null,
            vaccine_id: data?.vaccine_id ?? null,
            catalog_code: null,
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
    case "view_plan":
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
      
    case "scheme_incomplete":
    case "scheme_completed":
    case "scheme_started":
      if (actionKey === "scheme_incomplete" || actionKey === "scheme_completed") {
        navigate("PetVaccinesRecord", { id: data?.pet_id });
      } else {
        navigate("HomeProfileDetails", { idSelectedPet: data?.pet_id });
      }
      break;

    case "view_scheme":
    case "view_health_record":
    case "view_pet_profile":
      navigate("HomeProfileDetails", { idSelectedPet: data?.pet_id });
      break;

    case "view_care_center":
    case "multiple_active_states":
    case "user_inactive_30d":
    case "user_inactive_7d":
      navigate("Health", { screen: "CareCenter" });
      break;

    default:
      console.warn("No global action mapped for", actionKey);
      break;
  }
};
