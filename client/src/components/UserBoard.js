import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import UserService from "../services/user.service";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
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
  }

  render() {
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
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>24/04/2020</td>
                  <td>Pending</td>
                  <td>MTB</td>
                  <td>#2020</td>
                  <td>
                    <Link to={"/app/single-experience"} className="nav-link">
                      <button className="btn-primary btn">View</button>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>24/04/2020</td>
                  <td>Approved</td>
                  <td>MTB</td>
                  <td>#2020</td>
                  <td>
                    <Link to={"/app/single-experience"} className="nav-link">
                      <button className="btn-primary btn">View</button>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>24/04/2020</td>
                  <td>Removed</td>
                  <td>MTB</td>
                  <td>#2020</td>
                  <td>
                    <Link to={"/app/single-experience"} className="nav-link">
                      <button className="btn-primary btn">View</button>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
