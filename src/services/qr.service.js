import axios from "axios";

//const API_URL = "http://143.198.152.77:4000" 
//const API_URL = "http://159.203.169.184:3000"
const API_URL = "http://64.225.10.229:3001"

class QrService {

    async checkQR(qrValue) {
        return axios
            .get(API_URL + "/qrstatus/" + qrValue)
            .then(response => {
                localStorage.setItem('allowClaim', JSON.stringify(response.data.allowClaim));
                if (qrValue !== undefined) {
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
