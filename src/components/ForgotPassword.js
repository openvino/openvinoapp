import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { withRouter } from "react-router-dom";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};



class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.state = {
      email: "",
      loading: false,
      message: "",
      currentUser: { email: "" },
      userReady: false,
      successful: false
    };
  }

//   async componentDidMount() {
    
//   }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
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
      AuthService.resetPassword(this.state.email).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
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
            message: resMessage,
            successful: false
          });
        }
      );
    } else {
      this.setState({
        loading: false,
        successful: false
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
            <span className="subh1">You will receive an email with instructions</span>
          </h1>

          <Form
            onSubmit={this.handleLogin}
            ref={(c) => {
              this.form = c;
            }}
          >
          {!this.state.successful && (
            <><div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChangeEmail}
                                validations={[required]} />
                        </div><div className="form-group"><div className="form-group"></div>
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={this.state.loading}
                                >

                                    {this.state.loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Reset Password</span>
                                </button>
                            </div></>
          )}
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

export default withRouter(ForgotPassword);
