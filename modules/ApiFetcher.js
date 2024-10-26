import AppStorage from "./AppStorage.js";
import axios from "axios";
import { URL } from "@env";

class ApiFetcher {
  constructor() {
    this.appStorage = new AppStorage();
  }

  buildUrl(endpoint) {
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
    if (response.status !== 200) {
      throw new Error("Status code error");
    }
    return response.data;
  }

  async _get(endpoint, tokenRequired = true) {
    try {
      const url = this.buildUrl(endpoint);
      const headers = await this.getHeaders(tokenRequired);
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
      console.error("Error in POST request:", error);
      throw error;
    }
  }
  async _put(endpoint, data, tokenRequired = true, isMultipart = false) {
    try {
      const url = this.buildUrl(endpoint);
      const headers = await this.getHeaders(tokenRequired, isMultipart);
      const response = await axios.put(url, data, { headers, timeout: 15000 });
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
  async login(data) {
    return await this._post("/login", data, false);
  }

  async registerUser(data) {
    return await this._post("/registers", data, false);
  }

  // user

  async updatePictureProfile(image) {
    return await this._put(`/profile/save/picture`, image, true, true);
  }

  async updateUser(data) {
    return await this._put(`/profile/update/information`, data);
  }
  
  async getProfile() {
    return await this._get("/profile");
  }

  // pets

  async registerPet(data) {
    return await this._post("/pets", data);
  }

  async updatePicturePet(id, image) {
    return await this._put(`/pets/save/picture/${id}`, image, true, true);
  }

  async updatePet(id, data) {
    return await this._put(`/pets/${id}`, data);
  }

  async getPetBrands(id) {
    return await this._get(`/pets_breeds?type_pet=${id}`, false);
  }

  async getPets() {
    return await this._get("/pets");
  }

  async getPetById(id) {
    return await this._get(`/pets/${id}`);
  }

  async deletePet(id) {
    return await this._delete(`/pets/${id}`);
  }

  // vaccines
  async getVaccines(id) {
    return await this._get(`/pets/${id}/vaccines`);
  }

  async saveVaccine(data) {
    return await this._post(`/pets/${data.pet_id}/vaccination_records`, data);
  }

  // partners

  async getPartners() {
    return await this._get("/partners");
  }

  async getPartnersById(id) {
    return await this._get(`/partners/${id}`);
  }

  // appointments

  async getAppointments() {
    return await this._get("/appointments");
  }

  async getAppointmentsByPet(id) {
    return await this._get(`/appointments?pet_id=${id}`);
  }

  async registerAppointments(data) {
    return await this._post("/appointments", data);
  }
}

export default ApiFetcher;
