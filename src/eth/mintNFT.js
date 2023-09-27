import { ethers } from "ethers";
import { createInstance } from "./forwader";

import { signMetaTxRequest } from "./signer";
async function gasLessMint(contract, provider, signer, uri) {
  try {
    const url = process.env.REACT_APP_WEBHOOK_URL;
    if (!url) throw new Error(`Missing relayer url`);

    const forwarder = createInstance(provider);
    const from = await signer.getAddress();
    // const from = "0xD71b6cF4517bF60279a7d1bda4bA781631E12d7d";
    const data = contract.interface.encodeFunctionData("safeMint", [from, uri]);
    const to = contract.address;

    const request = await signMetaTxRequest(signer.provider, forwarder, {
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
  }
}

export async function registerMint(contract, provider, data) {
  const chainId = process.env.REACT_APP_CHAIN_ID;

  try {
    if (!data) throw new Error(`Data cannot be empty`);
    if (!window.ethereum) throw new Error(`User wallet not found`);

    // Verificar si el usuario ya ha dado permiso
    const accounts = await window.ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
      .then((e) => {
        console.log(e);
      });

    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const userNetwork = await userProvider.getNetwork();

    if (userNetwork.chainId !== Number(chainId)) {
      // El usuario no está en la red correcta, esperar cambio de red
      await switchToCorrectNetwork();
    }

    const signer = userProvider.getSigner();
    const from = await signer.getAddress();
    const balance = await provider.getBalance(from);

    const response = await gasLessMint(contract, provider, signer, data);
    if (response?.status !== 200) {
      throw new Error("Error please try again later or contact support");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function switchToCorrectNetwork() {
  try {
    const switchNetworkResult = await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: process.env.REACT_APP_NETWORK_TARGET_ID }],
    });

    if (switchNetworkResult) {
      // La red se ha cambiado exitosamente.
      // Puedes continuar con el proceso.
    } else {
      // El usuario canceló o hubo un error al cambiar de red.
      throw new Error("Network switch canceled or failed.");
    }
  } catch (error) {
    addNetwork();

    // handle "add" error
    console.log("Error switching network:", error);
    // Puedes decidir cómo manejar esta situación, por ejemplo, mostrar un mensaje al usuario y volver a intentar después de un tiempo
  }
}

export async function addNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: process.env.REACT_APP_NETWORK_TARGET_ID,
          chainName: process.env.REACT_APP_NETWORK_NAME,
          rpcUrls: [process.env.REACT_APP_NETWORK_RPC] /* ... */,
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}
