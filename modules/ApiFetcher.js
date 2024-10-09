import AppStorage from "./AppStorage.js";
import axios from "axios";

const BASE_URL =
  "https://api.tobipets.mx/api/v1/portal_client";

export default class ApiFetcher {
  constructor() {
    this.appStorage = new AppStorage();
    this.userId = null;
  }

  async _get(url) {
    url = `${BASE_URL}${url}`;
    const token = await this.appStorage.getAppToken();
    console.log("GET url => ", url);

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("Headers => ", headers);

    const response = await axios.get(url, {
      headers,
      timeout: 15000,
    });

    if (response.status == 200) {
      return response.data;
    } else {
      const error = "Status code error";
      throw error;
    }
  }

  //DELETE
  async _delete(url) {
    url = `${BASE_URL}${url}`;
    const token = await this.appStorage.getAppToken();
    console.log("DELETE url => ", url);
  
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    console.log("Headers => ", headers);
  
    try {
      const response = await axios.delete(url, {
        headers,
        timeout: 15000,
      });
  
      if (response.status == 200) {
        return response.status;
      } else {
        const error = "Status code error";
        throw error;
      }
    } catch (error) {
      console.error("Error", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async _getNoToken(url) {
    url = `${BASE_URL}${url}`;
    console.log("GET url => ", url);
    const headers = {
      Accept: "application/json",
    };

    console.log("Headers => ", headers);

    const response = await axios.get(url, {
      headers,
      timeout: 15000,
    });

    if (response.status == 200) {
      return response.data;
    } else {
      const error = "Status code error";
      throw error;
    }
  }

  async _post(url, data) {
    const token = await this.appStorage.getAppToken();

    url = `${BASE_URL}${url}`;
    console.log("Post url => ", url);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };

    console.log("Headers => ", headers);

    const response = await axios.post(url, data, {
      headers,
      timeout: 15000,
    });

    if (response.status == 200) {
      return response.data;
    }

    const error = "Status code error";
    throw error;
  }

  async _putPicture(url, image) {
    const token = await this.appStorage.getAppToken();

    url = `${BASE_URL}${url}`;
    console.log("Put url => ", url);

    const headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${token}`,
    };

    console.log("image => ", image);
    console.log("Headers => ", headers);

    const response = await axios.put(url, image, {
      headers,
      timeout: 15000,
    });

    if (response.status == 200) {
      return response.data;
    }

    console.log("Put response => ", response);
    const error = "Status code error";
    throw error;
  }

  async _put(url, data) {
    const token = await this.appStorage.getAppToken();

    url = `${BASE_URL}${url}`;
    console.log("Put url => ", url);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };

    console.log("Data => ", data);
    console.log("Headers => ", headers);

    const response = await axios.put(url, data, {
      headers,
      timeout: 15000,
    });

    if (response.status == 200) {
      return response.data;
    }

    console.log("Put response => ", response);
    const error = "Status code error";
    throw error;
  }

  async _postNoToken(url, data) {
    url = `${BASE_URL}${url}`;
    console.log("Post no token Url => ", url);

    try {
      const response = await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 15000,
      });

      if (response.status === 200) {
        return response.data;
      }
      console.log("Response no token => ", response);
      throw new Error("Status code error");
    } catch (error) {
      if (error.response) {
        console.log("Error: ", error.response);
        console.log("Error response status:", error.response.data.errors);
        return error.response.data;
      }
      // throw error;
    }
  }

  async login(data) {
    const url = `/login`;
    return await this._postNoToken(url, data);
  }

  async registerUser(data) {
    const url = `/registers`;
    return await this._postNoToken(url, data);
  }

  async registerPet(data) {
    const url = `/pets`;
    return await this._post(url, data);
  }

  async updatePicturePet(id, image) {
    const url = `/pets/save/picture/${id}`;
    return await this._putPicture(url, image);
  }

  async updatePictureProfile(image) {
    const url = `/profile/save/picture`;
    return await this._putPicture(url, image);
  }

  async updatePet(id, data) {
    const url = `/pets/${id}`;
    return await this._put(url, data);
  }

  async updateUser(data) {
    const url = `/profile/update/information`;
    return await this._put(url, data);
  }

  // async getExample() {
  //   const url = `/getExample`;
  //   return await this._get(url);
  // }

  async getPetBrands(id) {
    const url = `/pets_breeds?type_pet=${id}`;
    return await this._getNoToken(url);
  }

  async getProfile() {
    const url = `/profile`;
    return await this._get(url);
  }

  async getPets() {
    const url = `/pets`;
    return await this._get(url);
  }

  async getPetById(id) {
    const url = `/pets/${id}`;
    return await this._get(url);
  }
  
  async deletePet(id){
    const url = `/pets/${id}`;
    return await this._delete(url);
  }

  async getVaccines(id) {
    const url = `/pets/${id}/vaccines`;
    return await this._get(url);
  }

  async saveVaccine(data) {
    const url = `/pets/${data.pet_id}/vaccination_records`;
    return await this._post(url, data);
  }

  async getPartners() {
    const url = `/partners`;
    return await this._get(url);
  }
  async getPartnersById(id) {
    const url = `/partners/${id}`;
    return await this._get(url);
  }

  async getAppointments() {
    const url = `/appointments`;
    return await this._get(url);
  }

  async getAppointmentsByPet(id) {
    const url = `/appointments?pet_id=${id}`;
    return await this._get(url);
  }

  async registerAppointments(data) {
    const url = `/appointments`;
    return await this._post(url, data);
  }
}
