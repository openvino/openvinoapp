import axios from "axios";

const API_URL = "http://165.232.157.193:3000";


class QrService {

    async checkQR(qrValue) {
        return axios
            .get(API_URL + "/qrstatus/" + qrValue)
            .then(response => {
                localStorage.setItem('allowClaim', JSON.stringify(response.data.allowClaim));
                localStorage.setItem('qrCodeT', JSON.stringify(qrValue));
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
