import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://143.198.152.77:4000" 
  

class ExperienceService {

  // /users/{id}/experiencesdetail
  async getExperiences(pUserId) {
    const response = await axios.get(API_URL + "/users/" + pUserId + "/experiencesdetail", {
      headers: authHeader(),
    }); 
    return response;
  }

  async addExperience(
    statusId,
    date,
    userId,
    location,
    qrValue,
    photoFileName,
    ipfsUrl
  ) {
    const response = await axios.post(
      API_URL + "/experiences",
      {
        date: date,
        location: location,
        statusId: statusId,
        qrValue: qrValue,
        photoFileName: photoFileName, //"https://ipfs.io/ipfs/QmbcKQTe44AYBrfhUypuUapCaQUQAHbWiqGufhR7eoCpwU"
        nftGenerated: false,
        userId: userId,
        ipfsUrl: ipfsUrl
      },
      {
        headers: authHeader(),
      }
    );

    // response ok : { "status" : true , "message" : "Nueva experiencia creada: 1", "experienceId" : 1 }
    // responose error: { "status" : false , "message" : "El QRValue no es válido", "experienceId" : 0 }
    return response;
  }

 async updateExperience(experienceId, nftGenerated, userId ) {
    const response = await axios.patch(
      API_URL + "/experiences/" + experienceId,
      {
        id: experienceId,
        nftGenerated: JSON.parse(nftGenerated),
        userId: userId
      },
      {
        headers: authHeader(),
      }
    ).then(
      (response) => {
        console.log(response);

      }
    ).catch((error) => {
      console.log(error);
    });
    // return response;
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
