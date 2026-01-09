import AppStorage from "./AppStorage.js";
import axios from "axios";
import { URL } from "@env"

class ApiFetcher {
  constructor() {
    this.appStorage = new AppStorage();
  }

  buildUrl(endpoint) {
    console.log("URL BASE >>>", URL);
    return `${URL}${endpoint}`;
  }

  async getHeaders(tokenRequired = true, isMultipart = false) {
    const headers = {
      Accept: "application/json",
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    };
    if (tokenRequired) {
      const token = await this.appStorage.getAppToken();
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  handleErrors(response) {
    console.log("a ver la respueseta", response)
    if (response.status < 200 || response.status >= 300) {
      if (response.data === "email.verification_already_done") {
        return response.data;
      }
      throw new Error("Status code error" + response.data);
    }
    return response.data;
  }

  async _get(endpoint, tokenRequired = true) {
    try {
      const url = this.buildUrl(endpoint);
      console.log("URL FINAL >>>", url);
      const headers = await this.getHeaders(tokenRequired);
      // console.log("headers: ", headers)
      const response = await axios.get(url, { headers, timeout: 15000 });

      return this.handleErrors(response);
    } catch (error) {
      console.error("Error in GET request:", error);
      throw error;
    }
  }

  async _post(endpoint, data, tokenRequired = true) {
    try {
      const url = this.buildUrl(endpoint);
      const headers = await this.getHeaders(tokenRequired);
      const response = await axios.post(url, data, { headers, timeout: 15000 });
      return this.handleErrors(response);
    } catch (error) {
      console.log("ERROR EN POST", error.response?.data || error.message);
      if (error.response) {
        const { status, data } = error.response;
        console.log("Status del error:", status);
        console.log("Data del error:", data);
        throw new Error(data?.error || data?.message || "Error desconocido");
      }
      throw new Error("Error de red o servidor no disponible");
    }
  }
  async _put(endpoint, data, tokenRequired = true, isMultipart = false) {
    try {
      const url = this.buildUrl(endpoint);
      const headers = await this.getHeaders(tokenRequired, isMultipart);
      console.log("url: ", url);
      console.log("headers: ", headers);
      console.log("data: ", data);
      const response = await axios.put(url, data, { headers, timeout: 30000 });
      console.log("response: ", response);
      return this.handleErrors(response);
    } catch (error) {
      console.error("Error in PUT request:", error);
      throw error;
    }
  }

  async _delete(endpoint, tokenRequired = true) {
    try {
      const url = this.buildUrl(endpoint);
      const headers = await this.getHeaders(tokenRequired);
      const response = await axios.delete(url, { headers, timeout: 15000 });
      return this.handleErrors(response);
    } catch (error) {
      console.error("Error in DELETE request:", error);
      throw error;
    }
  }

  // Métodos específicos de la API

  // auth
  async sendVerification(mail) {
    return await this._post("/v1/portal_client/registers/send_verification_email", mail, false);
  }
  async verifyPin(data) {
    return await this._post("/v1/portal_client/registers/verify_email", data, false);
  }
  async login(data) {
    return await this._post("/v2/auth/login", data, false);
  }

  async registerUser(data) {
    return await this._post("/v1/portal_client/registers", data, false);
  }

  // user

  async updatePictureProfile(image) {
    return await this._put(`/profile/save/picture`, image, true, true);
  }

  async updateUser(data) {
    return await this._put(`/profile/update/information`, data);
  }

  async sendPin(data) {
    return await this._post(`/v2/auth/forgot_password`, data);
  }

  async updatePassword(data) {
    return await this._put(`/v2/auth/update_password`, data);
  }

  async getProfile() {
    return await this._get("v1/portal_client/profile");
  }

  async getBlogs() {
    return await this._get("/v1/portal_client/blogs");
  }

  // pets

  async registerPet(data) {
    return await this._post("/v1/portal_client/pets", data);
  }

  async updatePicturePet(id, image) {
    return await this._put(`/v1/portal_client/pets/save/picture/${id}`, image, true, true);
  }

  async updatePet(id, data) {
    return await this._put(`/v1/portal_client/pets/${id}`, data);
  }

  async getPetBrands(id) {
    return await this._get(`/v1/portal_client/pets_breeds?type_pet=${id}`, false);
  }

  async getPets() {
    return await this._get("/v1/portal_client/pets");
  }

  async getPetById(id) {
    return await this._get(`/v1/portal_client/pets/${id}`);
  }

  async deletePet(id) {
    return await this._delete(`/v1/portal_client/pets/${id}`);
  }

  // vaccines
  async getVaccines(id) {
    return await this._get(`/v1/portal_client/pets/${id}/vaccines`);
  }

  async getVaccinesRecords(id) {
    return await this._get(`/v1/portal_client/pets/${id}/vaccination_records`);
  }

  async saveVaccine(data) {
    return await this._post(`/v1/portal_client/pets/${data.pet_id}/vaccination_records`, data);
  }

  async saveDewormer(data) {
    return await this._post(`/v1/portal_client/pets/${data.pet_id}/dewormer_records`, data);
  }

  async getCertificates(id) {
    return await this._get(`/v1/portal_client/pets/certificate/${id}`);
  }

  async saveCertificate(id, data) {
    return await this._put(`/v1/portal_client/pets/save/certificate/${id}`, data, true, true);
  }
  // partners

  async getPartners() {
    return await this._get("/v1/portal_client/partners");
  }

  async getPartnersById(id) {
    return await this._get(`/v1/portal_client/partners/${id}`);
  }

  // appointments

  async getAppointments() {
    return await this._get("/v1/portal_client/appointments");
  }

  async getAppointmentsByPet(id) {
    return await this._get(`/v1/portal_client/appointments?pet_id=${id}`);
  }

  async getAvailabilityDaysByPartnerId(id) {
    return await this._get(`/v1/portal_client/partners/${id}/availability/days`);
  }

  async getAvailabilitySlotsByServices(id, date, services) {
    const urlComplement = services
      .map(service => `service_ids[]=${service.id}`)
      .join('&');
    return await this._get(`/v1/portal_client/partners/${id}/availability/slots?date=${date}&${urlComplement}`);
  }

  async registerAppointments(data) {
    return await this._post("/v1/portal_client/appointments", data);
  }

  // notifications

  async getNotifications() {
    return await this._get("/v1/portal_client/notifications");
  }
  /*async updateNotificationStatus(){
    return await this._put("/notifications")
  }*/
}

export default ApiFetcher;
