import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Switch, Route, Link } from "react-router-dom";

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

    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser } = this.state;
    console.log(currentUser);
    return (
      <div>
        <header className="jumbotron">
          <div className="row">
            <div className="col-md">
              <h3>
                <strong>{currentUser.email}</strong> Profile
              </h3>
            </div>
            <div className="col-md">
              <Link to={"/edit-profile"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </header>
        {this.state.userReady ? (
          <div className="container profile-card">
            <p>
              <strong>Token:</strong> {currentUser.token.substring(0, 20)}{" "}
              ...{" "}
              {currentUser.token.substr(
                currentUser.token.length - 20
              )}
            </p>
            <p>
              <strong>Id:</strong> {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>First Name:</strong> {currentUser.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {currentUser.lastName}
            </p>
            <p>
              <strong>Address:</strong> {currentUser.address}
            </p>
            <p>
              <strong>Birthdate:</strong> {currentUser.birthDate}
            </p>
            <p>
              <strong>Telegram ID:</strong> {currentUser.telegramId}
            </p>
            <p>
              <strong>Wallet Address:</strong> {currentUser.walletAddress}
            </p>
            <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}
