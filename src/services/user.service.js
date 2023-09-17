import axios from "axios";
import authHeader from "./auth-header";
import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_API_URL: API_URL } = process.env;


class UserService {
  getPublicContent() {
    return axios.get(API_URL + "/all");
  }

  getUserBoard() {
    return axios.get(API_URL + "/app/user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "/mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "/admin", { headers: authHeader() });
  }
}

export default new UserService();
