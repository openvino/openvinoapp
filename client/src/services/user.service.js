import axios from 'axios';
import authHeader from './auth-header';

// Prod
// const API_URL = "http://165.232.157.193:3000";
// Dev
const API_URL = "http://104.248.49.119:3000";  

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
