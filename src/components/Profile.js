import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import i18next from "i18next";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { email: "" },
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser } = this.state;
    const { currentToken } = this.state;
    console.log(currentUser);
    return (
      <div>
        <header className="jumbotron">
          <div className="row">
            <div className="col-md">
              <h3>
                <strong>{currentUser.email}</strong>
              </h3>
            </div>
            <div className="col-md">
              <Link to={"/app/edit-profile"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                  {i18next.t("Edit Profile")}
                </button>
              </Link>
            </div>
          </div>
        </header>
        {this.state.userReady ? (
          <div className="container profile-card">
            {/* <p>
              <strong>Token:</strong> {currentToken.substring(0, 20)}{" "}
              ...{" "}
              {currentToken.substr(
                currentToken.length - 20
              )}
            </p> */}
            <p>
              <strong>{i18next.t("Id")}:</strong> {currentUser.id}
            </p>
            <p>
              <strong>{i18next.t("Email")}:</strong> {currentUser.email}
            </p>
            <p>
              <strong>{i18next.t("First Name")}:</strong> {currentUser.firstName}
            </p>
            <p>
              <strong>{i18next.t("Last Name")}:</strong> {currentUser.lastName}
            </p>
            <p>
              <strong>{i18next.t("Mailing Address")}:</strong> {currentUser.address_1}
            </p>
            <p>
              <strong>{i18next.t("Birthdate")}:</strong> {currentUser.birthDate}
            </p>
            <p>
              <strong>{i18next.t("Telegram ID")}:</strong> {currentUser.telegramId}
            </p>
            <p>
              <strong>{i18next.t("DNI/Passport")}:</strong> {currentUser.walletAddress}
            </p>
            {/* <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
            </ul> */}
          </div>
        ) : null}
      </div>
    );
  }
}
