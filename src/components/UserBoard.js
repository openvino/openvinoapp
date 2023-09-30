import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import ExperienceService from '../services/experience.service';
import { mintToken, switchNetwork } from '../Web3Client';
import { create } from 'ipfs-http-client';
import i18next from 'i18next';
import { createInstance } from '../eth/Ydiyoi';
import { createProvider } from '../eth/provider';
import LoadingSpinner from './Spinner';
/* Create an instance of the client */
const client = create('https://ipfs.infura.io:5001/api/v0');

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      userReady: false,
      currentUser: { email: '' },
      // experiencesCount: "",
      experiences: [],
      currentExperiences: [],
      minted: false,
      experienceId: '',
      ipfsUrl: '',
      redirect: null,
      alert: null,
      errorMessage: null,
      loading: false,
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    if (!currentUser) {
      this.setState({ redirect: '/' });
    } else {
      this.setState({ userId: currentUser.id });
      const currentExperiences = await ExperienceService.getExperiences(
        currentUser.id
      );
      this.setState({
        currentExperiences: currentExperiences,
      });
    }

    if (window.ethereum === undefined) {
      this.setState({
        alert: i18next.t('No wallet'),
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

    // console.log(this.state.experiences);
  }

  // Mint Function

  async createCollectible(index) {
    console.log(this.state.experiences[index].ipfsUrl);
    this.setState({
      loading: true,
    });
    try {
      const url = this.state.experiences[index].ipfsUrl;
      const finalURL = await url.replace('ipfs.infura.io', 'ipfs.io');
      console.log(finalURL);
      this.setState({
        nftGenerated: true,
        experienceId: this.state.experiences[index].id,
      });
      // Added IPFS URL to LocalStorage.
      localStorage.setItem('ipfsURL', this.state.experiences[index].ipfsUrl);
      // console.log(this.state.ipfsUrlJSON);
      // console.log(this.state.nftGenerated);
      try {
        await mintToken(url)
          .then((tx) => {
            console.log(tx);
            this.setState({
              minted: true,
            });
            //  Removed IPFS from LocalStorage after success minting
            ExperienceService.updateExperience(
              this.state.experienceId,
              this.state.nftGenerated,
              this.state.currentUser.id
            ).then(() => {
              window.location.reload();
            });
            // console.log(this.state.nftGenerated);
            // The following line fixes experiencie not matching minting bug
            localStorage.removeItem('ipfsURL');
          })
          .catch((err) => {
            // const url = "";
            // const added = ""
            console.log(err.message);

            this.setState({
              errorMessage:
                err.message + ' Please try again later or refresh this page',
            });

            // console.log(url);
            // console.log(added);
            // localStorage.removeItem("ipfsURL");
          });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log('Error uploading file: ', error);
      //localStorage.removeItem("ipfsURL");
      const finalURL = '';
      const added = '';
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (this.state.redirect) {
      // return <Redirect to={this.state.redirect} />;
    }

    // const sortedExperiences = this.state.experiences.slice().sort((a, b) => {
    //   const dateA = new Date(a.date);
    //   const dateB = new Date(b.date);

    //   return dateB - dateA;
    // });

    // const listItems = sortedExperiences.map((item, index) => (
    //   <tr key={item.id}>
    //     <td>{item.date}</td>
    //     <td>{item.wine.name}</td>
    //     <td>{item.wine.qrValue.slice(0, item.wine.qrValue.length - 6)}</td>
    //     {/* <td>{i18next.t("Coming Soon")}</td> */}
    //     <td>
    //       {!item.nftGenerated ? (
    //         <button
    //           tabIndex={index}
    //           value={index}
    //           className="btn-primary btn"
    //           // onClick with index of the experience for create JSON file and upload to IPFS
    //           onClick={() => this.createCollectible(index)}
    //           disabled={this.state.loading}
    //         >
    //           {i18next.t('Mint NFT')}
    //         </button>
    //       ) : (
    //         <p>{i18next.t('NFT Minted Successfully!')}</p>
    //       )}
    //     </td>
    //   </tr>
    // ));

    const listItems = this.state.experiences.map((item, index) => (
      <tr key={item.id}>
        <td>{item.date}</td>
        <td>{item.wine.name}</td>
        <td>{item.wine.qrValue.slice(0, item.wine.qrValue.length - 6)}</td>
        {/* <td>{i18next.t("Coming Soon")}</td> */}
        <td>
          {!item.nftGenerated ? (
            <button
              tabIndex={index}
              value={index}
              className="btn-primary btn"
              // onClick with index of the experience for create JSON file and upload to IPFS
              onClick={() => this.createCollectible(index)}
              disabled={this.state.loading}
            >
              {i18next.t('Mint NFT')}
              {this.state.loading && <LoadingSpinner />}
            </button>
          ) : (
            <p>{i18next.t('NFT Minted Succesfully!')}</p>
          )}
        </td>
      </tr>
    ));
    return (
      <div className="container">
        {this.state.alert && (
          <div className="center alert-danger">
            <p className=""> {this.state.alert}</p>
          </div>
        )}

        {/* <div className="row info-message">
          <div className="col-md">
            <p>
              <i className="fas fa-exclamation-triangle"></i>{" "}
              {i18next.t(
                "Minting is currently available only on ETH Mainnet. Check your Network on Metamask"
              )}
            </p>
          </div>
        </div> */}
        <header className="jumbotron" id="jumbotron-userboard">
          <div className="row">
            <div className="col-md">
              <h3>{i18next.t('Tastings')}</h3>
            </div>
            <div className="col-md">
              {/* <Link to={'/app/add-tasting'} className="nav-link"> */}
              {/* <button className="btn btn-secondary new-experience-button">
                  {i18next.t('New Tasting')}
                </button> */}
              {/* {!item.nftGenerated ? (
                <button
                  tabIndex={index}
                  value={index}
                  className="btn-primary btn"
                  // onClick with index of the experience for create JSON file and upload to IPFS
                  onClick={() => this.createCollectible(index)}
                  disabled={this.state.loading}
                >
                  {i18next.t('Mint NFT')}
                </button>
              ) : (
                <p>{i18next.t('NFT Minted Succesfully!')}</p>
              )} */}
              {/* </Link> */}
            </div>
          </div>
        </header>
        <div className="container tastings-card">
          <div className="table-responsive-sm">
            {this.state.errorMessage && (
              <div className="center alert-danger">
                <p className="">{this.state.errorMessage}</p>
              </div>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{i18next.t('Date')}</th>
                  <th scope="col">{i18next.t('Token')}</th>
                  <th scope="col">{i18next.t('Token ID')}</th>
                  <th scope="col">{i18next.t('Actions')}</th>
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
