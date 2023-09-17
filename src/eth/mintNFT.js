import { ethers } from "ethers";
import { createInstance } from "./forwader";

import { signMetaTxRequest } from "./signer";

async function gasLessMint(contract, provider, signer, uri) {
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
}

export async function registerMint(contract, provider, data) {
  const chainId = process.env.REACT_APP_CHAIN_ID;

  try {
    if (!data) throw new Error(`Name cannot be empty`);
    if (!window.ethereum) throw new Error(`User wallet not found`);
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const userNetwork = await userProvider.getNetwork();

    if (userNetwork.chainId !== Number(chainId))
      throw new Error(`Please switch to Mumbai for signing`);

    const signer = userProvider.getSigner();
    const from = await signer.getAddress();
    const balance = await provider.getBalance(from);

    const response = await gasLessMint(contract, provider, signer, data);
  } catch (error) {
    throw new Error("Error");
    console.log(error);
  }
}
