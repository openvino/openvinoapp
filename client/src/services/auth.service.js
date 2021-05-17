import axios from "axios";

const API_URL = "http://165.232.157.193:3000/explorer/#/UserController/UserController.";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password, firstName, lastName, address, birthDate, telegramId, walletAddress) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      firstName,
      lastName,
      address,
      birthDate,
      telegramId,
      walletAddress
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
