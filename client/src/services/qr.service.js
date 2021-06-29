import axios from "axios";

const API_URL = "http://165.232.157.193:3000";


class QrService {

    async checkQR(qrValue) {
        try {
            const response = await axios.get(API_URL + "/qrstatus/" + qrValue);
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }

}

export default new QrService();
