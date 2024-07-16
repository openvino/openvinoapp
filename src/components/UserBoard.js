import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import ExperienceService from "../services/experience.service";
import { mintToken, switchNetwork } from "../Web3Client";
import { create } from "ipfs-http-client";
import i18next from "i18next";
import LoadingSpinner from "./Spinner";
// import { web3authLogin, coreKitInstance } from "../services/web3auth";

// import useWebWallet from "../hooks/useWebWallet";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useWebWallet } from "../hooks/useWebWallet";

// import { useHistory } from "react-router-dom";

/* Create an instance of the client */
const client = create("https://ipfs.infura.io:5001/api/v0");

const BoardUser = () => {
  const [content, setContent] = useState("");
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ email: "" });
  const [experiences, setExperiences] = useState([]);
  const [currentExperiences, setCurrentExperiences] = useState([]);
  const [minted, setMinted] = useState(false);
  const [experienceId, setExperienceId] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [alert, setAlert] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState([]);
  const [webProvider, setWebProvider] = useState(null);
  const history = useHistory();
  const webWalletData = useWebWallet();
  const {
    webWalletUser,
    webWalletAddress,
    webWalletProvider,
    webWalletSigner,
    webWalletIsInitialized,
    webWalletIsConnected,
    connectWebWallet,
    disconnectWebWallet,
    updateWebWalletUserInfo,
  } = webWalletData;
  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = AuthService.getCurrentUser();
      const currentToken = AuthService.getToken();
      if (!currentUser) {
        setRedirect("/");
      } else {
        setCurrentUser(currentUser);
        setUserReady(true);
        const currentExperiences = await ExperienceService.getExperiences(
          currentUser.id
        );
        setCurrentExperiences(currentExperiences);

        if (window.ethereum === undefined) {
          setAlert(i18next.t("No wallet"));
        }

        UserService.getUserBoard().then(
          (response) => {
            setContent(response.data);
          },
          (error) => {
            setContent(
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message ||
                error.toString()
            );
          }
        );

        ExperienceService.getExperiences(currentUser.id).then(
          (response) => {
            setExperiences(response.data);
            setExperienceLoading(response.data.map(() => false));
          },
          (error) => {
            setExperiences(
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message ||
                error.toString()
            );
          }
        );
      }
    };

    loadUserData();
  }, []);

  const createCollectible = async (index) => {
    const newExperienceLoading = [...experienceLoading];
    newExperienceLoading[index] = true;
    setExperienceLoading(newExperienceLoading);
    setLoading(true);

    try {
      const url = experiences[index].ipfsUrl;
      setExperienceId(experiences[index].id);
      localStorage.setItem("ipfsURL", experiences[index].ipfsUrl);

      try {
        console.log("hola", webProvider?.status);
        await mintToken(url, webWalletData)
          .then((tx) => {
            console.log(tx);
            setMinted(true);

            ExperienceService.updateExperience(
              experiences[index].id,
              true,
              currentUser.id
            ).then(() => {
              window.location.reload();
            });
            localStorage.removeItem("ipfsURL");
          })
          .catch((err) => {
            console.log(err.message);
            setErrorMessage(
              err.message + " Please try again later or refresh this page"
            );
          });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
    } finally {
      newExperienceLoading[index] = false;
      setExperienceLoading(newExperienceLoading);
      setLoading(false);
    }
  };

  if (redirect) {
    // return <Redirect to={redirect} />;
  }

  const listItems = experiences.map((item, index) => (
    <tr key={item.id}>
      <td>
        {item && item.photoFileName && (
          <img
            style={{ borderRadius: "50%" }}
            src={item.photoFileName.replace("ipfs.infura.io", "ipfs.io")}
            width={100}
            height={100}
          />
        )}
      </td>
      <td>{item.date}</td>
      <td>{item.wine.name}</td>
      <td>{item.wine.qrValue.slice(0, item.wine.qrValue.length - 6)}</td>

      <td>
        {!item.nftGenerated ? (
          <button
            tabIndex={index}
            value={index}
            className="btn-primary btn"
            onClick={() => createCollectible(index)}
            disabled={loading}
          >
            {!experienceLoading[index] && i18next.t("Mint NFT")}
            {experienceLoading[index] && <LoadingSpinner />}
          </button>
        ) : (
          <p>{i18next.t("NFT Minted Successfully!")}</p>
        )}
      </td>
    </tr>
  ));
  const handleLogin = async () => {
    console.log("handleLogin");
    const result = await connectWebWallet();
    console.log("result", webWalletUser, webWalletAddress, webWalletProvider);
  };
  const handleLogut = async () => {
    console.log("handleLogut");
    const result = await disconnectWebWallet();
    console.log("result", result);
  };
  return (
    <div className="container">
      {alert && (
        <div className="center alert-danger">
          <p className=""> {alert}</p>
        </div>
      )}

      <header className="jumbotron" id="jumbotron-userboard">
        <div className="row">
          <div className="col-md">
            <h3>{i18next.t("Tastings")}</h3>
            <button onClick={() => handleLogin()}>CONNECT</button>
          </div>
          <div className="col-md">
            <h3>{i18next.t("Tastings")}</h3>
            <button onClick={() => handleLogut()}>DISCONNECT</button>
          </div>
        </div>
      </header>
      <div className="container tastings-card">
        <div className="table-responsive-sm">
          {errorMessage && (
            <div className="center alert-danger">
              <p className="">{errorMessage}</p>
            </div>
          )}
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">{i18next.t("Date")}</th>
                <th scope="col">{i18next.t("Token")}</th>
                <th scope="col">{i18next.t("Token ID")}</th>
                <th scope="col">{i18next.t("Actions")}</th>
              </tr>
            </thead>
            <tbody>{listItems}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BoardUser;
