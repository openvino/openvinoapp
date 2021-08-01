import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./assets/images/website-logo.png";
import { withRouter } from "react-router-dom";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/UserBoard";
import BoardModerator from "./components/ModBoard";
import BoardAdmin from "./components/AdminBoard";
import NewExperience from "./components/NewExperience";
import EditProfile from "./components/EditProfile";
import SingleExperience from "./components/SingleExperience";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.redirectTimeout = null;
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      test:''
    };
  }


  componentDidMount() {
    const test = window.location.pathname;
    console.log(test);
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        test: test
        //showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        //showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard, test } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand">
          <Link to={"/"} className="navbar-brand">
            <img className="logo-header" src={logo} />
          </Link>
          <div className="navbar-nav mr-auto">
            {/* <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li> */}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/app/mod"} className="nav-link">
                  Winery Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/app/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/app/user"} className="nav-link">
                  Experiences
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/app/profile"} className="nav-link">
                  <i className="far fa-user-circle"></i> {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/app/login" className="nav-link" onClick={this.logOut}>
                  <i className="fas fa-power-off"></i>
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/app/login"} className="nav-link">
                  <button className="btn btn-primary btn-block">Login</button>
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/app/register"} className="nav-link">
                  <button className="btn btn-secondary btn-block">
                    Register
                  </button>
                </Link>
              </li>
            </div>
          )}
        </nav>
        <div className="container mt-3">
          <Switch>
            <Route exact path={"/"} component={Home} />
            <Route exact path={"/:id"} component={Home} />
            <Route exact path="/app/login" component={Login} />
            <Route exact path="/app/login/:id" component={Login} />
            <Route exact path="/app/register/:id" component={Register} />
            <Route exact path="/app/register" component={Register} />
            <Route exact path="/app/profile" component={Profile} />
            <Route path="/app/user" component={BoardUser} />
            <Route path="/app/mod" component={BoardModerator} />
            <Route path="/app/admin" component={BoardAdmin} />
            <Route path="/app/add-experience" component={NewExperience} />
            <Route path="/app/edit-profile" component={EditProfile} />
            <Route path="/app/single-experience" component={SingleExperience} />
            </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
