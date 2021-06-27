import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Switch, Route, Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeBirthday = this.onChangeBirthday.bind(this);
    this.onChangeTelegram = this.onChangeTelegram.bind(this);
    this.onChangeWalletAddress = this.onChangeWalletAddress.bind(this);

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
  }

  onChangeFirstName(e) {
    this.setState({
      firstName: e.target.value,
    });
  }

  onChangeLastName(e) {
    this.setState({
      lastName: e.target.value,
    });
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value,
    });
  }

  onChangeBirthday(e) {
    this.setState({
      birthdate: e.target.value,
    });
  }

  onChangeTelegram(e) {
    this.setState({
      telegramId: e.target.value,
    });
  }

  onChangeWalletAddress(e) {
    this.setState({
      walletAddress: e.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      address,
      birthdate,
      telegramId,
      walletAddress,
    } = this.state;
    alert(`Your registration detail: \n 
           First Name: ${firstName} \n 
           Last Name: ${lastName} \n
           Address: ${address} \n
           Birthdate: ${birthdate} \n
           Telegram: ${telegramId} \n
           Wallet Address: ${walletAddress}`);
  };


  render() {
    const { currentUser } = this.state;
    const { currentToken } = this.state;
    console.log(currentUser);

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div>
        <header className="jumbotron">
          <div className="row">
            <div className="col-md">
              <h3>
                <strong>{currentUser.email}</strong> Edit Profile
              </h3>
            </div>
            <div className="col-md">
              <Link to={"/profile"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                  Back to Profile
                </button>
              </Link>
            </div>
          </div>
        </header>
        {this.state.userReady ? (
          <div className="container profile-card">
            <Form
              onSubmit={this.handleSubmit}
              ref={(c) => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={this.state.firstName}
                      placeholder={currentUser.firstName}
                      onChange={this.onChangeFirstName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={this.state.lastName}
                      placeholder={currentUser.lastName}
                      onChange={this.onChangeLastName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="address"
                      value={this.state.address}
                      placeholder={currentUser.address_1}
                      onChange={this.onChangeAddress}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birthdate">Birthdate</label>
                    <Input
                      type="date"
                      className="form-control"
                      name="birthdate"
                      value={this.state.birthdate}
                      placeholder={currentUser.birthDate}
                      onChange={this.onChangeBirthday}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telegramId">Telegram ID</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="telegramId"
                      value={this.state.telegramId}
                      placeholder={currentUser.telegramId}
                      onChange={this.onChangeTelegram}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="walletAddress">Wallet Address</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="walletAddress"
                      value={this.state.walletAddress}
                      placeholder={currentUser.walletAddress}
                      onChange={this.onChangeWalletAddress}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">
                      Update
                    </button>
                  </div>
                </div>
              )}

              {this.state.message && (
                <div className="form-group">
                  <div
                    className={
                      this.state.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        ) : null}
      </div>
    );
  }
}
