import axios from "axios";

const API_URL = "http://165.232.157.193:3000";


class QrService {

    async checkQR(qrValue) {
        try {
            const response = await axios.get(API_URL + "/qrstatus/" + qrValue);
            console.log(response.data.allowClaim);
        } catch (error) {
            console.log(error);
        }
    }

    async checkQR_test(qrValue) {
        return axios
        .get(API_URL + "/qrstatus/" + qrValue)
        .then (response => {
            console.log("response.data");
            console.log(response.data);
            console.log(response.data.allowClaim);
            // guardo en sesión para utilizardo desde el resto de la app
            localStorage.setItem('allowClaim', JSON.stringify(response.data.allowClaim));
            //retorna el valor boolean de allowClaim
            return response.data.allowClaim;
        });
    }

    // esto lo agrego siguinedo el modelo de auth.service
    getallowClaim() {
        return JSON.parse(localStorage.getItem('allowClaim'));
      }

}

export default new QrService();
