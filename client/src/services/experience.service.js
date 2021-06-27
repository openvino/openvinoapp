import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://165.232.157.193:3000";


class ExperienceService {

  addExperience(photoFileName, statusId, date, userId, location, qrValue) {
      return axios
      .post(API_URL + "/experiences", {
          "date": date,
          "location": location,
          "photoFileName": photoFileName,
          "statusId": statusId,
          "qrValue": qrValue,
          "userId": userId
      },{ headers: authHeader() })
  }
}

export default new ExperienceService();
