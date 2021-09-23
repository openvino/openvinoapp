import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import ExperienceService from "../services/experience.service";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      userReady: false,
      currentUser: { email: "" },
      experiencesCount: "",
      experiences: [],
      currentExperiences: []
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    const currentExperiences = await ExperienceService.getExperiences(currentUser.id);

    this.setState({
      currentExperiences: currentExperiences,
    });

    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
    UserService.getUserBoard().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );

    await ExperienceService.getExperiences(currentUser.id).then(
      (response) => {
        console.log(response.data.length);
        this.setState({
          experiences: response.data,
        });
        for (let i = 0; i < response.data.length; i++) {
          this.setState({
            experiencesCount: response.data.length,
          });
        
        }
        console.log(this.state.experiences);
      },
      (error) => {
        this.setState({
          experiences:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
   
    const listItems = this.state.experiences.map((item) => (
       <tr>
                  <td>{item.date}</td>
                  <td>{item.statusId}</td>
                  <td>{item.wine.name}</td>
                  <td>{item.wine.qrValue}</td>
                  <td>
                    <Link to={"/app/user"} className="nav-link">
                      <button className="btn-primary btn">Mint</button>
                    </Link>
                  </td>
                </tr>
    )
    );
    console.log(this.state.experiences);

    return (
      <div className="container">
        <header className="jumbotron">
          <div className="row">
            <div className="col-md">
              <h3>Experiences</h3>
            </div>
            <div className="col-md">
              <Link to={"/app/add-experience"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                  New Experience
                </button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container profile-card">
          <div className="table-responsive-sm">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Token</th>
                  <th scope="col">Token ID</th>
                  <th scope="col">Mint NFT</th>
                </tr>
              </thead>
              <tbody>
                {listItems}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
