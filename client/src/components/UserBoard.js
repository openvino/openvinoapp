import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import ExperienceService from "../services/experience.service";
import { mintToken } from "../Web3Client";
import { create } from "ipfs-http-client";
import { Redirect } from "react-router-dom";

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
      experienceId: "",
      ipfsUrl:"",
      redirect: null,
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    if (!currentUser) {
      this.setState({ redirect: "/" });
    } else {
      this.setState({ userId: currentUser.id });
      const currentExperiences = await ExperienceService.getExperiences(
        currentUser.id
      );
      this.setState({
        currentExperiences: currentExperiences,
      });
    }
   
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
    //console.log(this.state.experiences[0].id);
    // console.log(this.state.experiences[3].experienceSurvey);
    // const listSurveys = this.state.experiences.map((surveys) => (
    //   JSON.stringify(surveys.experienceSurvey)
    // ))
    // console.log(listSurveys);
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
  // Mint Function
  async createCollectible(index) {
    try {
      const listSurveys = this.state.experiences.map(
        (surveys) => (
          // Create JSON file based on experience information
          JSON.stringify(surveys.experienceSurvey)
        )
      );
      const added = await client.add(listSurveys[index]);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      this.setState({
        ipfsUrlJSON: url,
        nftGenerated: true,
        experienceId: this.state.experiences[index].id,
      });
      console.log(this.state.ipfsUrlJSON);
      // Added IPFS URL to LocalStorage.
      localStorage.setItem("ipfsURL", this.state.ipfsUrlJSON);
      mintToken()
        .then((tx) => {
          console.log(tx);
          this.setState({
            minted: true,
          });
          // Removed IPFS from LocalStorage after success minting
          localStorage.removeItem("ipfsURL");
          ExperienceService.updateExperience(this.state.experienceId)(
            this.state.nftGenerated,
            this.state.ipfsUrl,
            this.state.nftURL
          ).then((response)=> {
          })
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    // Mint Token Function Called
    // const createCollectible = () => {
    //   mintToken()
    //     .then((tx) => {
    //       console.log(tx);
    //       this.setState({
    //         minted: true,
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // };
    const listItems = this.state.experiences.map((item, index) => (
      <tr key={item.id}>
        <td>{item.date}</td>
        <td>{item.statusId}</td>
        <td>{item.wine.name}</td>
        <td>{item.wine.qrValue}</td>
        <td><b>Minting Coming Soon</b></td>
        {/* <td>
          {!item.nftGenerated ? (
            <button
              tabIndex={index}
              value={index}
              className="btn-primary btn"
              // onClick with index of the experience for create JSON file and upload to IPFS
              onClick={() => this.createCollectible(index)}
            >
              {" "}
              Mint Experience NFT
            </button>
          ) : (
            <p>NFT Minted Succesfully!</p>
          )}
        </td> */}
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
