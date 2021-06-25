import axios from "axios";

const API_URL = "http://165.232.157.193:3000";


class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "/login", {
        "email": email,
        "password": password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(email, password, firstName, lastName, address, birthDate, telegramId, walletAddress) {
    
    let birthday = new Date(birthDate);
    
    return axios.post( API_URL + "/signup", {
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
    return JSON.parse(localStorage.getItem('user'));
  }


}

export default new AuthService();
