import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Switch, Route, Link } from "react-router-dom";

export default class SingleExperience extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
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
              <h3>Experience ID {currentUser.id}</h3>
            </div>
            <div className="col-md">
              <Link to={"/user"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                  Back to Experiences
                </button>
              </Link>
            </div>
          </div>
        </header>
        {this.state.userReady ? (
          <div className="container profile-card">
            <p>
              <strong>QR Code:</strong>{" "}
              {currentUser.token.substring(0, 20)} ...{" "}
              {currentUser.token.substr(
                currentUser.token.length - 20
              )}
            </p>
            <p>
              <strong>Date:</strong> 24/02/2020
            </p>
            <p>
              <strong>Tokens:</strong> 1
            </p>
            <p>
              <strong>Status:</strong> Pending
            </p>
          </div>
        ) : null}
      </div>
    );
  }
}
