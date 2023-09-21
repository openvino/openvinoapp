import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_API_URL: API_URL } = process.env;


class QrService {
  async checkQR(qrValue) {
    return axios.get(API_URL + "/qrstatus/" + qrValue).then((response) => {
      localStorage.setItem(
        "allowClaim",
        JSON.stringify(response.data.allowClaim)
      );
      if (qrValue !== undefined) {
        localStorage.setItem("qrCodeT", JSON.stringify(qrValue));
      }
      return response.data.allowClaim;
    });
  }

  getallowClaim() {
    return JSON.parse(localStorage.getItem("allowClaim"));
  }

  getQRClaimed() {
    return JSON.parse(localStorage.getItem("qrCodeT"));
  }
}

export default new QrService();
