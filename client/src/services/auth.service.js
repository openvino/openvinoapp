import axios from "axios";

// Prod
// const API_URL = "http://165.232.157.193:3000";
// Dev
const API_URL = "http://104.248.49.119:3000";  


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
