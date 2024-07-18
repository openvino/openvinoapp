import { ethers } from "ethers";
import { createInstance } from "./forwader";

import { signMetaTxRequest } from "./signer";
async function gasLessMint(
  contract,
  provider,
  signer,
  uri,
  webWalletProvider,
  webWalletSigner,
  webWalletAddress,
  webWalletUser
) {
  console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(uri);
  try {
    const url = process.env.REACT_APP_WEBHOOK_URL;
    if (!url) throw new Error(`Missing relayer url`);

    const forwarder = createInstance(provider);
    let from;
    if (webWalletAddress) {
      from = webWalletAddress;
      console.log("from", from);
    } else {
      from = await signer.getAddress();
      console.log("from", from);
    }

    const data = contract.interface.encodeFunctionData("safeMint", [from, uri]);
    const to = contract.address;
    const endSigner = webWalletSigner ? webWalletSigner : signer.provider;
    const request = await signMetaTxRequest(endSigner, forwarder, {
      uri,
      to,
      from,
      data,
    });

    console.log(request);

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);

    throw new Error(error.message);
  }
}

export async function registerMint(contract, provider, data, webWalletData) {
  console.log(webWalletData);

  const {
    webWalletProvider,
    webWalletSigner,
    webWalletAddress,
    webWalletUser,
  } = webWalletData;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  console.log(
    webWalletProvider,
    webWalletSigner,
    webWalletAddress,
    webWalletUser
  );
  try {
    if (!data) throw new Error(`Data cannot be empty`);

    let userProvider;

    if (webWalletProvider) {
      console.log("hola");
      userProvider = webWalletData.webWalletProvider;
    } else if (typeof window.ethereum !== "undefined") {
      // Metamask u otro proveedor de Web3
      console.log("hola2");
      userProvider = new ethers.providers.Web3Provider(window.ethereum);
    } else if (typeof window.web3 !== "undefined") {
      // Web3.js o Web3.py

      console.log("hola3");
      userProvider = new ethers.providers.Web3Provider(
        window.web3.currentProvider
      );
    } else {
      throw new Error(
        "No Web3 provider detected. Please install a Web3 wallet extension or use a compatible browser."
      );
    }
    let userNetwork;
    // Esperar a que el proveedor esté listo

    if (!webWalletProvider) {
      await userProvider.send("eth_requestAccounts", []);
      userNetwork = await userProvider.getNetwork();
      const networkToAdd = {
        chainId: process.env.REACT_APP_NETWORK_TARGET_ID,
        chainName: process.env.REACT_APP_NETWORK_NAME,
        rpcUrls: [process.env.REACT_APP_NETWORK_RPC] /* ... */,
      };
      if (userNetwork.chainId !== Number(chainId)) {
        // El usuario no está en la red correcta, esperar cambio de red
        await userProvider.send("wallet_addEthereumChain", [networkToAdd]);
      } else {
        // El proveedor está listo, cambiar de red si es necesario
        await userProvider.send("wallet_switchEthereumChain", [
          { chainId: process.env.REACT_APP_NETWORK_TARGET_ID },
        ]);
      }
    } else {
      userNetwork = await webWalletProvider.getNetwork();
    }
    console.log(userNetwork);

    const signer = webWalletSigner ? webWalletSigner : userProvider.getSigner();
    console.log(signer);
    // Solicitar cuentas al usuario
    let accounts;
    let from;

    if (!webWalletProvider) {
      accounts = await signer.provider.send("eth_requestAccounts", []);
      from = accounts[0];
    } else {
      from = webWalletAddress;
    }

    if ((accounts && accounts.length > 0) || webWalletProvider) {
      const response = await gasLessMint(
        contract,
        provider,
        signer,
        data,
        webWalletProvider,
        webWalletSigner,
        webWalletAddress,
        webWalletUser
      );
      if (response?.status !== 200) {
        throw new Error("Error please try again later or contact support");
      }
    } else {
      throw new Error("User denied account access.");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

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
