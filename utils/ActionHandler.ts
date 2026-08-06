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

  switch (action) {
    case "view_home":
      navigate("Home");
      break;

    case "view_appointment":
      if (data?.visit_id) {
        navigate("Health", { screen: "VisitDetails", params: { id: data.visit_id } });
      } else {
        navigate("Health", { screen: "AppointmentsHome" });
      }
      break;

    case "view_vaccines":
    case "view_deworming":
    case "vaccine_expired":
    case "dewormer_expired":
    case "weight_low":
    case "weight_high":
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
      break;

    case "book_consultation":
    case "book_appointment":
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
      break;

    case "view_summary":
      if (data?.visit_summary_id) {
        apiFetcher.markVisitSummaryOpened(data.visit_summary_id).catch(e => console.warn(e));
      }
      if (data?.visit_id) {
        navigate("Health", { screen: "VisitDetails", params: { id: data.visit_id } });
      } else {
        navigate("Health", { screen: "AppointmentsHome" });
      }
      break;

    case "view_recommendation":
      navigate("HomeProfileDetails", { idSelectedPet: data?.pet_id });
      break;

    case "edit_profile":
      navigate("ProfileStack", { screen: "ProfileEditUser" });
      break;

    case "add_pet":
      navigate("RegisterNewPet", { returnTo: "HomeScreen" });
      break;

    case "view_scheme":
    case "view_health_record":
    case "view_pet_profile":
      navigate("HomeProfileDetails", { idSelectedPet: data?.pet_id });
      break;

    case "scheme_incomplete":
    case "scheme_completed":
      navigate("PetVaccinesRecord", { id: data?.pet_id });
      break;

    default:
      console.warn("No global action mapped for", action);
      break;
  }
};
