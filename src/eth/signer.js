import { BigNumber, ethers } from "ethers";

const ethSigUtil = require("eth-sig-util");

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
}

async function signTypedData(signer, from, data) {
  console.log(signer);
  // If signer is a private key, use it to sign
  if (typeof signer === "string") {
    const privateKey = Buffer.from(signer.replace(/^0x/, ""), "hex");
    console.log("privateKey", privateKey);
    return ethSigUtil.signTypedMessage(privateKey, { data });
  }

  // Otherwise, send the signTypedData RPC call
  // Note that hardhatvm and metamask require different EIP712 input
  // const isHardhat = data.domain.chainId == 31337;
  console.log(data);
  const [method, argData] = ["eth_signTypedData_v4", JSON.stringify(data)];
  console.log(method, argData);
  // console.log(typeof signer.signMessage);
  // ? ["eth_signTypedData", data]
  // : ["eth_signTypedData_v4", JSON.stringify(data)];
  if (!signer._isSigner) {
    console.log("provider");
    return await signer.send(method, [from, argData]);
  } else {
    console.log(argData);
    console.log(from, data.message);
    // const message = {
    //   to: "0xCc1d6D42F1f966134059e077C540506B6F656960",
    //   value: BigNumber.from(0), // Valor en ether
    //   gasLimit: 1000000,
    //   nonce: 0,
    //   data: argData,
    // };
    // console.log(data.message);
    // const formattedMessage = { ...message };
    // return await signer.signMessage(data.message);
  }
}

async function buildRequest(forwarder, input) {
  const nonce = await forwarder
    .getNonce(input.from)
    .then((nonce) => nonce.toString());
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder, request) {
  const chainId = await forwarder.provider.getNetwork().then((n) => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

export async function signMetaTxRequest(signer, forwarder, input) {
  console.log(signer);
  const request = await buildRequest(forwarder, input);
  console.log(request);
  const toSign = await buildTypedData(forwarder, request);
  console.log(toSign);
  const signature = await signTypedData(signer, input.from, toSign);
  console.log(signature);
  return { signature, request };
}
