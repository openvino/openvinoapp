import axios from "axios";
import authHeader from "./auth-header";
import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_API_URL: API_URL } = process.env;

//const API_URL = "http://143.198.152.77:4000"
//const API_URL = "http://159.203.169.184:3000"

class AuthService {
  async login(email, password) {
    const response = await axios.post(API_URL + "/login", {
      email: email,
      password: password,
    });
    if (response.data.loginResponse.token) {
      localStorage.setItem(
        "token",
        JSON.stringify(response.data.loginResponse.token)
      );
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.loginResponse.user)
      );
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  async update(
    userId,
    firstName,
    lastName,
    address,
    birthDate,
    telegramId,
    walletAddress
  ) {
    let birthday = new Date(birthDate);
    const response = await axios
      .patch(
        API_URL + "/users/" + userId,
        {
          id: userId,
          firstName: firstName,
          lastName: lastName,
          telegramId: telegramId,
          birthDate: birthday,
          address_1: address,
          walletAddress: walletAddress,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    //return response;
  }

  // update(firstName, lastName, address, birthDate, telegramId, walletAddress, userId) {

  //   let birthday = new Date(birthDate);

  //   return axios.patch(API_URL + "/users/" + userId, {
  //     "firstName": firstName,
  //     "lastName": lastName,
  //     "telegramId": telegramId,
  //     "birthDate": birthday,
  //     "address_1": address,
  //     "walletAddress": walletAddress,
  //     "roleId": 1,
  //     "statusId": 3,
  //     "resetKey": "string"
  //   }, {
  //     headers: authHeader(),
  //   });
  // }

  resetPassword(email) {
    return axios.post(API_URL + "/reset-password/init", {
      email: email,
    });
  }

  updatePassword(resetkey, password, confirmPassword) {
    return axios.put(API_URL + "/reset-password/finish", {
      resetkey: resetkey,
      password: password,
      confirmPassword: confirmPassword,
    });
  }

  register(
    email,
    password,
    firstName,
    lastName,
    address,
    birthDate,
    telegramId,
    walletAddress
  ) {
    let birthday = new Date(birthDate);

    console.log("manda al registro>>>>", {
      firstName: firstName,
      lastName: lastName,
      telegramId: telegramId,
      birthDate: birthday,
      email: email,
      address_1: address,
      address_2: "",
      password: password,
      walletAddress: walletAddress,
      roleId: 1,
      statusId: 3,
    });

    return axios.post(API_URL + "/signup", {
      firstName: firstName,
      lastName: lastName,
      telegramId: telegramId,
      birthDate: birthday,
      email: email,
      address_1: address,
      address_2: "",
      password: password,
      walletAddress: walletAddress,
      roleId: 1,
      statusId: 3,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getToken() {
    return JSON.parse(localStorage.getItem("token"));
  }
}

export default new AuthService();
