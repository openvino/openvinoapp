import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import AuthService from '../services/auth.service';
import qrService from '../services/qr.service';
import { withRouter } from 'react-router-dom';
import i18next from 'i18next';

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        {i18next.t('This field is required!')}
      </div>
    );
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.state = {
      email: '',
      password: '',
      loading: false,
      message: '',
      currentUser: { email: '' },
      userReady: false,
      qrValid: false,
    };
  }

  async componentDidMount() {
    const qrValid = await qrService.checkQR(this.props.match.params.id);
    this.setState({ qrValid });
    qrService.checkQR(this.props.match.params.id);

    console.log('qrvalid:', qrValid);
    //console.log(qrService.getallowClaim());
    //console.log(qrService.getQRClaimed());
    qrService.getallowClaim();
    qrService.getQRClaimed();
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

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: '',
      loading: true,
    });

    this.form.validateAll();
    // if (!this.state.qrValid) {
    //   this.props.history.push('/app/user');
    //   window.location.reload();
    // }

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.email, this.state.password).then(
        () => {
          this.props.history.push('/app/add-tasting');
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
            message: resMessage,
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
            {i18next.t('You Drink it, You Own it!')}

            {/* <br />
            <span className="subh1">Sign in to continue!</span> */}
          </h1>

          <Form
            onSubmit={this.handleLogin}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="email">{i18next.t('Email')}</label>
              <Input
                type="text"
                className="form-control"
                name="email"
                value={this.state.email}
                onChange={this.onChangeEmail}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{i18next.t('Password')}</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>
            <a href="/app/forgot-password" style={{ color: '#840c4a' }}>
              {i18next.t('Forgot Password?')}
            </a>
            <div className="form-group">
              <div className="form-group"></div>
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>{i18next.t('Login')}</span>
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
              style={{ display: 'none' }}
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

export default withRouter(Login);
