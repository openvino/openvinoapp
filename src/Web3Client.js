import Web3 from "web3";

import NFTContractBuild from "../src/contract/YDIYOI.json";
import dotenv from "dotenv";
import { registerMint } from "./eth/mintNFT";
import { createInstance } from "./eth/Ydiyoi";
import { createProvider } from "./eth/provider";
import { initWeb3Auth, web3authLogin } from "./services/web3auth";

dotenv.config();
let token_uri = localStorage.getItem("ipfsURL");

let selectedAccount;

let SimpleCollectible;
let web3;
let isInitialized = false;
let provider;
const { REACT_APP_CONTRACT_ADDRESS, REACT_APP_NETWORK_TARGET_ID } = process.env;

export const mintToken = async (token, webWalletData) => {
  // if (!isInitialized) {
  //   await init();
  // }

  const provider2 = createProvider();
  const contract = createInstance(provider2);

  return await registerMint(contract, provider2, token, webWalletData);

  // if (!isInitialized) {
  //   await init();
  // }
  // console.log(selectedAccount);
  // // We pass the NFT link (token_uri), going to need to make a request to get that link from API.
  // return SimpleCollectible.methods
  //   .safeMint(selectedAccount, token_uri)
  //   .send({ from: selectedAccount });
};

// Function to clear complete cache data
// const clearCacheData = () => {
//   caches.keys().then((names) => {
//     names.forEach((name) => {
//       caches.delete(name);
//     });
//   });
//   // alert('Complete Cache Cleared')
// };

// switches network to the one provided
export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: process.env.REACT_APP_NETWORK_TARGET_ID }],
    });
  } catch (error) {
    console.log(error);

    return "NoWallet";
  }
};
