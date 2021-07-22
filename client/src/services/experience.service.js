import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://165.232.157.193:3000";

class ExperienceService {

  addExperience(photoFileName, statusId, date, userId, location, qrValue) {
        let dateFormatted = new Date(date);

      return axios
      .post(API_URL + "/experiences", {
          "date": dateFormatted,
          "location": location,
          "photoFileName": photoFileName,
          "statusId": statusId,
          "qrValue": qrValue,
          "userId": userId
      },{ headers: authHeader() })
  }
  
  async getQuestions(id) {
    return axios
    .get(API_URL + "​/survey-questions/" + id) 
    .then (response => {
      console.log(response.data);
    },{ headers: authHeader() })
    .catch(e =>  {
      console.log(e);
    });
  }
}

// datos de prueba
// {
//   "date": "2021-06-27T22:02:40.593Z",
//   "location": "Mi casa",
//   "photoFileName": "photoFileName",
//   "statusId": 1,
//   "qrValue": "MTB18.00002.226C9",
//   "userId": 2
// }


export default new ExperienceService();
