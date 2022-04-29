import axios from 'axios';
import authHeader from './auth-header';

//const API_URL = "http://143.198.152.77:4000" 
//const API_URL = "http://159.203.169.184:3000"
// const API_URL = process.env.APPLICATION_URL;
const API_URL = "https://nft.openvino.org:3000"

class UserService {
  getPublicContent() {
    return axios.get(API_URL + '/all');
  }

  getUserBoard() {
    return axios.get(API_URL + '/app/user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + '/mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + '/admin', { headers: authHeader() });
  }
}

export default new UserService();
