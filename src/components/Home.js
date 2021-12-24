import React, { Component } from "react";
import UserService from "../services/user.service";
import qrService from "../services/qr.service";
import Login from "./Login";
import AuthService from "../services/auth.service";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      currentUser: { email: "" },
      userReady: false,
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
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    if (!currentUser)
      this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
    console.log(qrValid);
    console.log(qrService.getallowClaim());
    console.log(qrService.getQRClaimed());
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
          currentUser: { email: "" },
          userReady: false,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
    console.log(this.state.currentUser);
  }

  render() {
    return <Login />;
  }
}
