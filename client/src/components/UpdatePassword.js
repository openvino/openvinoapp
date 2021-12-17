import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import qrService from "../services/qr.service";
import { withRouter } from "react-router-dom";
import { useSearchParams } from 'react';


const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};



class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      message: "",
      userReady: false,
      resetkey: ""
    };
  }

  async componentDidMount() {
    //const qrValid = await qrService.checkQR(this.props.match.params.id);
    //qrService.checkQR(this.props.match.params.id);
    //console.log(qrValid);
    //console.log(qrService.getallowClaim());
    //console.log(qrService.getQRClaimed());
    qrService.getallowClaim();
    qrService.getQRClaimed();
    const searchParams = window.location.search;
    const params = new URLSearchParams(searchParams)
    const reset = params.get('resetKey')
    this.setState({ resetkey: reset})
    //this.setState({ qrValue: qrValid});
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    if (!currentUser)
    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
    
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

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.updatePassword(this.state.resetkey, this.state.password, this.state.confirmPassword).then(
        () => {
          this.props.history.push("/app/add-experience");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.error.message) ||
            error.message ||
            error.toString();



          this.setState({
            loading: false,
            message: resMessage ,
          });
        }
      );
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
   
    return (
      <div className="col-md-12">
        <div className="card card-container login-form">
          <h1>
            Reset your password,
            <br />
            <span className="subh1">Update and confirm your new password</span>
          </h1>

          <Form
            onSubmit={this.handleLogin}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Confirm Password</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.confirmPassword}
                onChange={this.onChangeConfirmPassword}
                validations={[required]}
              />
            </div>
            <div className="form-group"><div className="form-group"></div>
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Update Password</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
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

export default withRouter(UpdatePassword);
