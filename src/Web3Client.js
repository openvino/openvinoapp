import Web3 from "web3";

import NFTContractBuild from "../src/contract/SimpleCollectible.json";

// GET Request for this parameter.
//let token_uri = "https://ipfs.io/ipfs/QmWxzMCE1EWWJ3vtyRqgD3mTt55jDsCqv3Wc2kbgUWuwv5?filename=1-MTB.json";

let token_uri = localStorage.getItem("ipfsURL");

let selectedAccount;

let SimpleCollectible;

let isInitialized = false;

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    // Metamask is installed

    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log("Selected account is ", { selectedAccount });
      })
      .catch((err) => {
        console.log(err);
        return;
      });
    // Account is changed Logic
    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log("Selected account changed to ", { selectedAccount });
    });
  }

  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();

  // Smart contract declare + contract address
  SimpleCollectible = new web3.eth.Contract(
    NFTContractBuild.abi,
    ([networkId].addressCon = "0x91fA0582307134C5f24A1738d76774C6d820a276")
  );

  isInitialized = true;
};

// Function to be called from App.js
export const mintToken = async () => {
  if (!isInitialized) {
    await init();
  } // We pass the NFT link (token_uri), going to need to make a request to get that link from API.
  return SimpleCollectible.methods
    .createCollectible(token_uri)
    .send({ from: selectedAccount });
};

// Function to clear complete cache data
const clearCacheData = () => {
  caches.keys().then((names) => {
    names.forEach((name) => {
      caches.delete(name);
    });
  });
  // alert('Complete Cache Cleared')
};
// targets Rinkeby chain, id 4
const targetNetworkId = "0x4";

// switches network to the one provided
export const switchNetwork = async () => {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: targetNetworkId }],
  });
};
