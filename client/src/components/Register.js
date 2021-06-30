import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import qrService from "../services/qr.service";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const qrCode = (value) => {
  if (value == false) {
    return (
      <div className="alert alert-danger" role="alert">
        Invalid QR Code.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeBirthDate = this.onChangeBirthDate.bind(this);
    this.onChangeTelegramId = this.onChangeTelegramId.bind(this);
    this.onChangeWalletAddress = this.onChangeWalletAddress.bind(this);

    /* QR Reading */
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      birthDate: "",
      telegramId: "",
      walletAddress: "",
      successful: false,
      qrValue: "",
      message: "",
    };
  }

  async componentDidMount() {
      const qrValid = await qrService.checkQR(this.props.match.params.id);
      console.log(qrValid);
      this.setState({ qrValue: qrValid});
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
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

  onChangeBirthDate(e) {
    this.setState({
      birthDate: e.target.value,
    });
  }

  onChangeTelegramId(e) {
    this.setState({
      telegramId: e.target.value,
    });
  }

  onChangeWalletAddress(e) {
    this.setState({
      walletAddress: e.target.value,
    });
  }

  

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.email,
        this.state.password,
        this.state.firstName,
        this.state.lastName,
        this.state.address,
        this.state.birthDate,
        this.state.telegramId,
        this.state.walletAddress,
        this.state.qrValue
      ).then(
        (response) => {
          this.props.history.push("/login");
          window.location.reload();
          this.setState({
            message: response.data.message,
            successful: true,
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container login-form">
          <h1>
            Welcome,
            <br />
            <span className="subh1">Register to continue!</span>
            <br />
          </h1>

          <Form
            onSubmit={this.handleRegister}
            ref={(c) => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
              <div className="form-group">
                  <Input
                    type="hidden"
                    className="form-control"
                    name="qrCode"
                    value={this.state.qrValue}
                    validations={[qrCode, required]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={this.state.firstName}
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
                    onChange={this.onChangeAddress}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birthDate">Birthdate</label>
                  <Input
                    type="date"
                    className="form-control"
                    name="birthDate"
                    value={this.state.birthDate}
                    onChange={this.onChangeBirthDate}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telegramId">Telegram ID</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="telegramId"
                    value={this.state.telegramId}
                    onChange={this.onChangeTelegramId}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="walletAddress">Wallet Address</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="walletAddress"
                    value={this.state.walletAddress}
                    onChange={this.onChangeWalletAddress}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">
                    Register
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
      </div>
    );
  }
}
