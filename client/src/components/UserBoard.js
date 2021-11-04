import React, { Component, useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import ExperienceService from "../services/experience.service";
import { init, mintToken } from "../Web3Client";
import { create } from "ipfs-http-client";

/* Create an instance of the client */
const client = create("https://ipfs.infura.io:5001/api/v0");

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      userReady: false,
      currentUser: { email: "" },
      experiencesCount: "",
      experiences: [],
      currentExperiences: [],
      minted: false,
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    const currentExperiences = await ExperienceService.getExperiences(
      currentUser.id
    );

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
        this.setState({
          experiences: response.data,
        });
        for (let i = 0; i < response.data.length; i++) {
          this.setState({
            experiencesCount: response.data.length,
          });
        }
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
    async onChangeFile(e) {
      const file = e.target.files[0];
      try {
        const added = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        this.setState({
          ipfsUrl: url,
        });
        console.log(this.state.ipfsUrl);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  render() {
    // Mint Token Function Called
    const createCollectible = () => {
      mintToken()
        .then((tx) => {
          console.log(tx);
          this.setState({
            minted: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const listItems = this.state.experiences.map((item) => (
      <tr>
        <td>{item.date}</td>
        <td>{item.statusId}</td>
        <td>{item.wine.name}</td>
        <td>{item.wine.qrValue}</td>
        <td>
        {!this.state.minted ?(
        <button className="btn-primary btn" onClick={() => createCollectible()}> Mint Experience NFT</button>
        ) : (
          <p>NFT Minted Succesfully!</p>
        ) }
        </td>
      </tr>
    ));

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
              <tbody>{listItems}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
