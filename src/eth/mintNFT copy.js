import { ethers } from "ethers";
import { createInstance } from "./forwader";

import { signMetaTxRequest } from "./signer";
import { initWeb3Auth } from "../services/web3auth";
async function gasLessMint(contract, provider, signer, uri, webWalletData) {
  console.log(contract);
  console.log(provider);
  console.log(webWalletData.webWalletSigner);
  console.log(uri);

  try {
    const url = process.env.REACT_APP_WEBHOOK_URL;
    if (!url) throw new Error("Missing relayer url");

    const forwarder = createInstance(provider);
    const from = webWalletData.webWalletAddress;
    const data = contract.interface.encodeFunctionData("safeMint", [from, uri]);
    const to = contract.address;
    console.log("hola", to, from, data);
    if (!webWalletData.webWalletSigner) throw new Error("No signer found");
    console.log("signer found", webWalletData.webWalletSigner);
    const request = await signMetaTxRequest(
      webWalletData.webWalletSigner,
      // signer.provider,

      forwarder,
      {
        uri,
        to,
        from,
        data,
      }
    );

    console.log(request);

    // return fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify(request),
    //   headers: { "Content-Type": "application/json" },
    // });
  } catch (error) {
    console.log(error);

    // throw new Error(error.message);
  }
}

export const registerMint = async (contract, provider, data, webWalletData) => {
  const { webWalletProvider, webWalletSigner } = webWalletData;
  console.log(webWalletSigner);
  try {
    // console.log("hla", userProvider);
    console.log(contract, provider, data);
    const chainId = process.env.REACT_APP_CHAIN_ID;
    if (!data) throw new Error("Data cannot be empty");

    let userProvider = webWalletProvider;
    console.log("===========================================>", userProvider);
    // if (typeof window.ethereum !== "undefined") {
    //   // Metamask u otro proveedor de Web3
    //   userProvider = new ethers.providers.Web3Provider(window.ethereum);
    // } else if (typeof window.web3 !== "undefined") {
    //   // Web3.js o Web3.py
    //   userProvider = new ethers.providers.Web3Provider(
    //     window.web3.currentProvider
    //   );
    // } else {
    //   throw new Error(
    //     "No Web3 provider detected. Please install a Web3 wallet extension or use a compatible browser."
    //   );
    // }

    // Esperar a que el proveedor esté listo
    // await webWalletProvider.send("eth_requestAccounts", []);

    // const userNetwork = await webWalletProvider.getNetwork();

    // console.log(userNetwork);
    // const networkToAdd = {
    //   chainId: process.env.REACT_APP_NETWORK_TARGET_ID,
    //   chainName: process.env.REACT_APP_NETWORK_NAME,
    //   rpcUrls: [process.env.REACT_APP_NETWORK_RPC],
    // };

    // if (userNetwork.chainId !== Number(chainId)) {
    //   console.log("hola");
    //   // El usuario no está en la red correcta, esperar cambio de red
    //   await userProvider.send("wallet_addEthereumChain", [networkToAdd]);
    // } else {
    //   console.log("hola");
    //   // El proveedor está listo, cambiar de red si es necesario
    //   await userProvider.send("wallet_switchEthereumChain", [
    //     { chainId: process.env.REACT_APP_NETWORK_TARGET_ID },
    //   ]);
    // }

    const signer = webWalletSigner;

    // Solicitar cuentas al usuario
    // const accounts = await signer.provider.send("eth_requestAccounts", []);
    // const accounts = await signer.provider.send("eth_requestAccounts", []);

    const response = await gasLessMint(
      contract,
      provider,
      webWalletSigner,
      data,
      webWalletData
    );
    // console.log(accounts);
    // if (accounts && accounts.length > 0) {
    //   const from = accounts[0];

    //   const response = await gasLessMint(contract, provider, signer, data);
    //   if (response?.status !== 200) {
    //     throw new Error("Error please try again later or contact support");
    //   }
    // } else {
    //   throw new Error("User denied account access.");
    // }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

async function switchToCorrectNetwork(userProvider) {
  try {
    const switchNetworkResult = await userProvider.send(
      "wallet_switchEthereumChain",
      [{ chainId: process.env.REACT_APP_NETWORK_TARGET_ID }]
    );

    if (switchNetworkResult) {
      // La red se ha cambiado exitosamente.
      // Puedes continuar con el proceso.
    } else {
      // El usuario canceló o hubo un error al cambiar de red.
      throw new Error("Network switch canceled or failed.");
    }
  } catch (error) {
    // handle "add" error
    console.log("Error switching network:", error);
    // Puedes decidir cómo manejar esta situación, por ejemplo, mostrar un mensaje al usuario y volver a intentar después de un tiempo
  }
}

async function addNetwork(userProvider) {
  try {
    await userProvider.send("wallet_addEthereumChain", [
      {
        chainId: process.env.REACT_APP_NETWORK_TARGET_ID,
        chainName: process.env.REACT_APP_NETWORK_NAME,
        rpcUrls: [process.env.REACT_APP_NETWORK_RPC] /* ... */,
      },
    ]);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}
