import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import i18next from "i18next";


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
      userId: '',
      firstName: '',
      lastName: '',
      telegramId: '',
      birthDate: '',
      address: '',
      walletAddress: ''
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    // const currentToken = AuthService.getToken();
    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ userId: currentUser.id });
    this.setState({ firstName: currentUser.firstName})
    this.setState({ lastName: currentUser.lastName})
    this.setState({ telegramId: currentUser.telegramId})
    this.setState({ birthDate: currentUser.birthDate})
    this.setState({ address: currentUser.address})
    this.setState({ walletAddress: currentUser.walletAddress})
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
      birthDate: e.target.value,
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

  handleUpdate = (e) => {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    this.form.validateAll();


    if (this.checkBtn.context._errors.length === 0) {
      AuthService.update(
        this.state.userId,
        this.state.firstName,
        this.state.lastName,
        this.state.telegramId,
        this.state.birthDate,
        this.state.address,
        this.state.walletAddress,
      ).then(
        (response) => {
          //this.props.history.push("/app/edit-profile");
          //window.location.reload();
          console.log(response);
          this.setState({
            message: response,
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
  };


  render() {
    const { currentUser } = this.state;
    // const { currentToken } = this.state;
    //console.log(this.state.firstName);
  

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div>
        <header className="jumbotron">
          <div className="row">
            <div className="col-md">
              <h3>
                <strong>{currentUser.email}</strong> {i18next.t("Edit Profile")}
              </h3>
            </div>
            <div className="col-md">
              <Link to={"/app/profile"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                {i18next.t("Back to Profile")}
                </button>
              </Link>
            </div>
          </div>
        </header>
        {this.state.userReady ? (
          <div className="container profile-card">
            <Form
              onSubmit={this.handleUpdate}
              ref={(c) => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="firstName">{i18next.t("First Name")}</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={this.state.firstName}
                      placeholder={this.state.firstName}
                      onChange={this.onChangeFirstName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">{i18next.t("Last Name")}</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={this.state.lastName}
                      placeholder={this.state.lastName}
                      onChange={this.onChangeLastName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">{i18next.t("Mailing Address")}</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="address"
                      value={this.state.address}
                      placeholder={this.state.address_1}
                      onChange={this.onChangeAddress}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birthDate">{i18next.t("Birthdate")}</label>
                    <Input
                      type="date"
                      className="form-control"
                      name="birthDate"
                      value={this.state.birthDate}
                      placeholder={this.state.birthDate}
                      onChange={this.onChangeBirthday}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telegramId">{i18next.t("Telegram ID")}</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="telegramId"
                      value={this.state.telegramId}
                      placeholder={this.state.telegramId}
                      onChange={this.onChangeTelegram}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="walletAddress">{i18next.t("DNI/Passport")}</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="walletAddress"
                      value={this.state.walletAddress}
                      placeholder={this.state.walletAddress}
                      onChange={this.onChangeWalletAddress}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">
                    {i18next.t("Update")}
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
