import axios from "axios";

// Dev
const API_URL = "http://104.248.49.119:3000";  
// const API_URL = "https://api.openvino.org";  


class QrService {

    async checkQR(qrValue) {
        return axios
            .get(API_URL + "/qrstatus/" + qrValue)
            .then(response => {
                localStorage.setItem('allowClaim', JSON.stringify(response.data.allowClaim));
                if (qrValue != undefined) {
                localStorage.setItem('qrCodeT', JSON.stringify(qrValue));
            }
                return response.data.allowClaim;
            });
    }

    getallowClaim() {
        return JSON.parse(localStorage.getItem('allowClaim'));
    }

    getQRClaimed() {
        return JSON.parse(localStorage.getItem('qrCodeT'));
    }

}

export default new QrService();
