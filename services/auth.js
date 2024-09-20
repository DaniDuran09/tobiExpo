/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { Platform } from 'react-native';
import { _axios } from './interceptors';


export const signUp = (data) => _axios.post('users', {
    email: data.email,
    lada: "52",
    phoneNumber: data.phone,
    password: data.password,
    country: "Mexico",
    status: "active",
    firstName: data.firstName,
    lastName: data.lastName,
}, {
    showPayload: true,
}).then(({ data }) => data);

export const signIn = () => _axios.get('portal_client/type_pets', {
    showPayload: true,
}).then(({ data }) => data);

export const listPet = (token) => _axios.get('portal_client/pets', {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const details = (token, id) => _axios.get(`users/${id}`, {
    headers: {
        "x-auth-token": `${token}` 
    },
    showPayload: true,
}).then(({ data }) => data);
 
export const petBrands = (type) => _axios.get(`portal_client/pets_breeds?type_pet=${type}`, {
    showPayload: true,
}).then(({ data }) => data);

export const activity = () => _axios.get(`portal_client/activity_levels`, {
    showPayload: true,
}).then(({ data }) => data);

export const foodTypes = (id) => _axios.get(`portal_client/type_foods?food_brand_id=${id}`, {
    showPayload: true,
}).then(({ data }) => data);

export const foodBrandsService = () => _axios.get(`portal_client/food_brands`, {
    showPayload: true,
}).then(({ data }) => data);

export const loginToby = (username, password) => _axios.post('portal_client/login', {
    username: username,
    password: password
}, {
    showPayload: true,
}).then(({ data }) => data);

export const registerToby = (json) => _axios.post('portal_client/registers', json, {
    showPayload: true,
}).then(({ data }) => data);

export const sendTicketTobi = (token, formData) => _axios.post(`portal_client/tickets/extract/text/picture`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    },
    transformRequest: (data, headers) => {
        // !!! override data to return formData
        // since axios converts that to string
        return formData;
    },
    showPayload: true,
}).then(({ data }) => data);

export const createPet = (token, payload) => _axios.post(`portal_client/pets`, payload, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const petEdit = (token, id, payload) => _axios.put(`portal_client/pets/${id}`, payload, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const petDelete = (token, id) => _axios.delete(`portal_client/pets/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const userProfile = (token) => _axios.get(`portal_client/profile`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const UpdateUser = (token, payload) => _axios.put(`portal_client/profile/update/information`, payload, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const userPicture = (token, formData) => _axios.put(`portal_client/profile/save/picture`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    },
    transformRequest: (data, headers) => {
        // !!! override data to return formData
        // since axios converts that to string
        return formData;
    },
    showPayload: true,
}).then(({ data }) => data);

export const petPicture = (token, id, formData) => _axios.put(`portal_client/pets/save/picture/${id}`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    },
    transformRequest: (data, headers) => {
        // !!! override data to return formData
        // since axios converts that to string
        return formData;
    },
    showPayload: true,
}).then(({ data }) => data);

export const userBackPicture = (token, formData) => _axios.put(`portal_client/profile/save/back/picture`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    },
    transformRequest: (data, headers) => {
        // !!! override data to return formData
        // since axios converts that to string
        return formData;
    },
    showPayload: true,
}).then(({ data }) => data);

export const getBlog = (token) => _axios.get(`portal_client/blogs`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const getPartens = (token) => _axios.get(`portal_client/partners`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const getPartensId = (token, id) => _axios.get(`portal_client/partners/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const payPartner = (token, partner, payload) => _axios.post(`portal_client/partners/${partner}/service/payment`, payload, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const getCards = (token) => _axios.get(`portal_client/cards`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const cardDelete = (token, id) => _axios.delete(`portal_client/cards/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);

export const createCard = (token, payload) => _axios.post(`portal_client/cards`, payload, {
    headers: {
        "Authorization": `Bearer ${token}`
    },
    showPayload: true,
}).then(({ data }) => data);