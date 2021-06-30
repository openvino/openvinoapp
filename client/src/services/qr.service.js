import axios from "axios";

const API_URL = "http://165.232.157.193:3000";


class QrService {

    async checkQR_old(qrValue) {
        try {
            const response = await axios.get(API_URL + "/qrstatus/" + qrValue);
            console.log(response.data.allowClaim);
        } catch (error) {
            console.log(error);
        }
    }

    async checkQR(qrValue) {
        return axios
        .get(API_URL + "/qrstatus/" + qrValue)
        .then (response => {
            console.log("response.data");
            console.log(response.data);
            console.log(response.data.allowClaim);
        });
    }


}

export default new QrService();
