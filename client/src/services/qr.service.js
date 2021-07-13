import axios from "axios";

const API_URL = "http://165.232.157.193:3000";


class QrService {

    async checkQR(qrValue) {
        return axios
        .get(API_URL + "/qrstatus/" + qrValue)
        .then (response => {
            //console.log("response.data");
            //console.log(response.data);
            //console.log(response.data.allowClaim);
            // guardo en sesión para utilizardo desde el resto de la app
            localStorage.setItem('allowClaim', JSON.stringify(response.data.allowClaim));
            localStorage.setItem('qrCodeT', JSON.stringify(qrValue));
            //retorna el valor boolean de allowClaim
            return response.data.allowClaim;
        });
    }

    // esto lo agrego siguinedo el modelo de auth.service
    getallowClaim() {
        return JSON.parse(localStorage.getItem('allowClaim'));
    }
    getQRClaimed() {
        return JSON.parse(localStorage.getItem('qrCodeT'));
    }
}

export default new QrService();
