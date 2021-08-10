import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://165.232.157.193:3000";

class ExperienceService {
  async addExperience(photoFileName, statusId, date, userId, location, qrValue) {

    const response = await axios
      .post(API_URL + "/experiences", {
        "date": date,
        "location": location,
        "photoFileName": photoFileName,
        "statusId": statusId,
        "qrValue": qrValue,
        "userId": userId
      },
        {
          headers: authHeader()
        });
    console.log(response.data);
    return response;
  }

  // returns an array only with the active questions
  async getQuestions() {

    const response = await axios
      .get(API_URL + "/survey-questions", { headers: authHeader() });
    console.log(response.data);
    return response;
  }

  async saveQuestions(experienceId, questions, answers) {
    const response = await axios
      .post(API_URL + "/experiences/" + experienceId + "/experience-survey", {
        "question1": questions[0],
        "answer1": answers[0],
        "question2": questions[1],
        "answer2": answers[1],
        "question3": questions[2],
        "answer3": answers[2],
        "experienceId": experienceId
      },
        {
          headers: authHeader()
        });
    console.log(response.data);
    return response;
  }

}

export default new ExperienceService();
