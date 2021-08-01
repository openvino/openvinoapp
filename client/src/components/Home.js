import React, { Component } from "react";
import {history} from 'react-dom';
import UserService from "../services/user.service";
import qrService from "../services/qr.service";
import Login from "./Login";
import AuthService from "../services/auth.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  async componentDidMount() {
    //const { history } = this.props;
    //console.log(window.location.pathname);
    //const qrpath = window.location.pathname;
    //const qrpathFormatted = qrpath.replace(/\"/g, "");
    //if(window.location.href.indexOf("MTB18") > -1 ) {  
    //this.redirectTimeout = setTimeout(() => {
    //history.push('/register'+qrpathFormatted)
  //}, 5000);
//}
    const qrValid = await qrService.checkQR(this.props.match.params.id);
    console.log(qrValid);
    console.log(qrService.getallowClaim());
    console.log(qrService.getQRClaimed());
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
     <Login />
    );
  }
}