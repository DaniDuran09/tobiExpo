import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "USER",
  APP_TOKEN: "APP_TOKEN",
  NOTIFICATIONS: "NOTIFICATIONS",
  EXPO_PUSH_TOKEN: "EXPO_PUSH_TOKEN",
};

class AppStorage {
  constructor() {}

  _saveJSONItem(key, jsonItem) {
    const stringItem = JSON.stringify(jsonItem);
    return AsyncStorage.setItem(key, stringItem);
  }

  _getJSONItem(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then((response) => {
          resolve(JSON.parse(response));
        })
        .catch((error) => {
          console.log("Error getting => ", key);
          reject(error);
        });
    });
  }

  _getStringItem(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  saveUser(user) {
    return this._saveJSONItem(STORAGE_KEYS.USER, user);
  }

  getUser() {
    return this._getJSONItem(STORAGE_KEYS.USER);
  }

  saveAppToken(token) {
    return AsyncStorage.setItem(STORAGE_KEYS.APP_TOKEN, token);
  }

  getAppToken() {
    return this._getStringItem(STORAGE_KEYS.APP_TOKEN);
  }

  saveExpoPushToken(token) {
    return AsyncStorage.setItem(STORAGE_KEYS.EXPO_PUSH_TOKEN, token);
  }

  getExpoPushToken() {
    return this._getStringItem(STORAGE_KEYS.EXPO_PUSH_TOKEN);
  }

  clearStorage(){
    return AsyncStorage.clear();
  }

  saveNotifications(notifications){
    return this._saveJSONItem(STORAGE_KEYS.USER, user);
  }

  getNotifications(){
    return this._getJSONItem(STORAGE_KEYS.APP_TOKEN);
  }
}

export default AppStorage;
