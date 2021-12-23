import axios from "axios";

const API_URL = process.env.REACT_APP_API;  
console.log(process.env.REACT_APP_API);

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
