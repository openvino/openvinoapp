import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./assets/images/website-logo.png";
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
import ForgotPassword from "./components/ForgotPassword";
import UpdatePassword from "./components/UpdatePassword";
import i18next from "i18next";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

function App() {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [value, setValue] = useState("en");

  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    // initWeb3Auth();
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Uncomment these lines if you want to use roles
      // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    history.push("/app/login");
  };

  const handleChange = (event) => {
    const newLang = event.target.value;
    setValue(newLang);
    i18n.changeLanguage(newLang);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  console.log("Optimism Version");
  // const handleweb3Login = async () => {
  //   const user = await userInfo();
  //   console.log("User info", user);
  // };
  return (
    <div>
      {/* <button onClick={handleweb3Login}>
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      </button> */}
      <nav className="navbar navbar-expand" id="top-header">
        <div className="language-selector">
          {["es", "en", "fr", "cat", "pr"].map((lang) => (
            <React.Fragment key={lang}>
              <li className="nav-item">
                <button className="item" onClick={() => changeLanguage(lang)}>
                  {lang.toUpperCase()}
                </button>
              </li>
              {lang !== "pr" && <li className="nav-item">|</li>}
            </React.Fragment>
          ))}
        </div>
      </nav>
      <nav className="navbar navbar-expand" id="header">
        <Link to={"#"} className="navbar-brand">
          <img alt="logo" className="logo-header" src={logo} />
        </Link>
        <div className="navbar-nav mr-auto mobile-nav">
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
            <li className="nav-item btn-secondary tasting">
              <Link to={"/app/user"} className="nav-link">
                {t("Tastings")}
              </Link>
            </li>
          )}
        </div>
        {currentUser ? (
          <div className="navbar-nav ml-auto mobile-nav">
            <li className="nav-item">
              <Link to={"/app/profile"} className="nav-link">
                <i className="far fa-user-circle"></i> {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/app/login" className="nav-link" onClick={logOut}>
                <i className="fas fa-power-off"></i>
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/app/login"} className="nav-link">
                <button className="btn btn-primary btn-block">
                  {t("Login")}
                </button>
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/app/register"} className="nav-link">
                <button className="btn btn-secondary btn-block">
                  {t("Register")}
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
          <Route path="/app/add-tasting" component={NewExperience} />
          <Route path="/app/edit-profile" component={EditProfile} />
          <Route path="/app/single-tasting" component={SingleExperience} />
          <Route path="/app/forgot-password" component={ForgotPassword} />
          <Route exact path="/app/update-password" component={UpdatePassword} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
