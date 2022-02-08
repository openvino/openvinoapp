import axios from "axios";

const API_URL = "http://143.198.152.77" 
 


class AuthService {
  async login(email, password) {
    const response = await axios
      .post(API_URL + "/login", {
        "email": email,
        "password": password
      });
    if (response.data.loginResponse.token) {
      localStorage.setItem('token', JSON.stringify(response.data.loginResponse.token));
      localStorage.setItem('user', JSON.stringify(response.data.loginResponse.user));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  update(email, password, firstName, lastName, address, birthDate, telegramId, walletAddress, userId) {

    let birthday = new Date(birthDate);

    return axios.patch(API_URL + "/users" + userId, {
      "firstName": firstName,
      "lastName": lastName,
      "telegramId": telegramId,
      "birthDate": birthday,
      "email": email,
      "address_1": address,
      "address_2": "",
      "password": password,
      "walletAddress": walletAddress,
      "roleId": 1,
      "statusId": 3,
      "resetKey": "string"
    });
  }

  resetPassword(email) {
    return axios.post(API_URL + "/reset-password/init", {
      "email": email
    });
  }

  updatePassword(resetkey, password, confirmPassword) {
    return axios.put(API_URL + "/reset-password/finish", {
      "resetkey": resetkey,
      "password": password,
      "confirmPassword": confirmPassword
    }) 
  }

  register(email, password, firstName, lastName, address, birthDate, telegramId, walletAddress) {

    let birthday = new Date(birthDate);

    return axios.post(API_URL + "/signup", {
      "firstName": firstName,
      "lastName": lastName,
      "telegramId": telegramId,
      "birthDate": birthday,
      "email": email,
      "address_1": address,
      "address_2": "",
      "password": password,
      "walletAddress": walletAddress,
      "roleId": 1,
      "statusId": 3
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

}

export default new AuthService();
