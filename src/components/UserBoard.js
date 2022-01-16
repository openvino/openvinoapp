import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import ExperienceService from "../services/experience.service";
import { mintToken, switchNetwork } from "../Web3Client";
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
      // experiencesCount: "",
      experiences: [],
      currentExperiences: [],
      minted: false,
      experienceId: "",
      ipfsUrl: "",
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
    switchNetwork();
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

    console.log(this.state.experiences);
    // console.log(this.state.experiencesCount);
  }
  // async onChangeFile(e) {
  //   const file = e.target.files[0];
  //   try {
  //     const added = await client.add(file);
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`;
  //     this.setState({
  //       ipfsUrl: url,
  //     });
  //     console.log(this.state.ipfsUrl);
  //   } catch (error) {
  //     console.log("Error uploading file: ", error);
  //   }
  // }
  // Mint Function

  async createCollectible(index) {
    const listSurveys = await this.state.experiences.map((surveys) =>
      // Create JSON file based on experience information
      //console.log(surveys)
      JSON.stringify(surveys.experienceSurvey)
    );
    console.log(listSurveys);

    try {
      const added = (await client.add(listSurveys[index])) || 0;
      const url = `https://ipfs.infura.io/ipfs/${added.path}` || 0;
      const finalURL = await url;
      this.setState({
        ipfsUrlJSON: finalURL,
        nftGenerated: true,
        experienceId: this.state.experiences[index].id,
      });
      // Added IPFS URL to LocalStorage.
      localStorage.setItem("ipfsURL", this.state.ipfsUrlJSON);
      // console.log(this.state.ipfsUrlJSON);
      // console.log(this.state.nftGenerated);

      await mintToken()
        .then((tx) => {
          console.log(tx);
          this.setState({
            minted: true,
          });
          // Removed IPFS from LocalStorage after success minting
          ExperienceService.updateExperience(
            this.state.experienceId,
            // this.state.ipfsUrlJSON,
            this.state.nftGenerated,
            this.state.currentUser.id
          ).then(() => {
            window.location.reload();
          });
          // console.log(this.state.nftGenerated);
          //localStorage.removeItem("ipfsURL");
        })
        .catch((err) => {
          // const url = "";
          // const added = ""
          console.log(err);
          // console.log(url);
          // console.log(added);
          // localStorage.removeItem("ipfsURL");
        });
    } catch (error) {
      console.log("Error uploading file: ", error);
      localStorage.removeItem("ipfsURL");
      const finalURL = "";
      const added = "";
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
        <td>{item.wine.name}</td>
        <td>{item.wine.qrValue}</td>
        <td>
          {!item.nftGenerated ? (
            <button
              tabIndex={index}
              value={index}
              className="btn-primary btn"
              // onClick with index of the experience for create JSON file and upload to IPFS
              onClick={() => this.createCollectible(index)}
            >
              {" "}
              Mint NFT
            </button>
          ) : (
            <p>NFT Minted Succesfully!</p>
          )}
        </td>
      </tr>
    ));
    return (
      <div className="container">
        <div className="row info-message">
          <div className="col-md">
            <p><i className="fas fa-exclamation-triangle"></i> Minting is currently available only on ETH Mainnet. Check your Network on Metamask</p>
          </div>
        </div>
        <header className="jumbotron" id="jumbotron-userboard">
          <div className="row">
            <div className="col-md">
              <h3>Tastings</h3>
            </div>
            <div className="col-md">
              <Link to={"/app/add-tasting"} className="nav-link">
                <button className="btn btn-secondary new-experience-button">
                  New Tasting
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
