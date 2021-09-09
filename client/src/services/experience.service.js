import axios from "axios";
import authHeader from "./auth-header";

// Prod
// const API_URL = "http://165.232.157.193:3000";
// Dev
const API_URL = "http://104.248.49.119:3000";

class ExperienceService {
  async getExperiences() {
    const response = await axios.get(API_URL + "/experiences/", {
      headers: authHeader(),
    });
    return response;
  }

  async addExperience(
    photoFileName,
    statusId,
    date,
    userId,
    location,
    qrValue,
    ipfsUrl
  ) {
    const response = await axios.post(
      API_URL + "/experiences",
      {
        date: date,
        location: location,
        photoFileName: photoFileName,
        statusId: statusId,
        qrValue: qrValue,
        ipfsUrl: ipfsUrl, //"https://ipfs.io/ipfs/QmbcKQTe44AYBrfhUypuUapCaQUQAHbWiqGufhR7eoCpwU"
        nftGenerated: false,
        userId: userId,
      },
      {
        headers: authHeader(),
      }
    );

    // response: { "status" : true , "message" : "Nueva experiencia creada: 1", "experienceId" : 1 }
    return response;
  }

  // returns an array only with the active questions
  async getQuestions() {
    const response = await axios.get(API_URL + "/survey-questions", {
      headers: authHeader(),
    });

    return response;
  }

  // recieves array of questions & answers
  async saveQuestions(experienceId, questions, answers) {
    const response = await axios.post(
      API_URL + "/experiences/" + experienceId + "/experience-survey",
      {
        question1: questions[0],
        answer1: answers[0],
        question2: questions[1],
        answer2: answers[1],
        question3: questions[2],
        answer3: answers[2],
        question4: questions[3],
        answer4: answers[3],
        question5: questions[4],
        answer5: answers[4],
        experienceId: experienceId,
      },
      {
        headers: authHeader(),
      }
    );

    return response;
  }
}

export default new ExperienceService();
