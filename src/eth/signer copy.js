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
  const { domain, types, message } = data;
  // const { message } = data;
  console.log(data);
  console.log(signer, from, data);

  message.nonce = "9";
  console.log(message.nonce);
  // return await signer._signTypedData(data.domain, data.types, data.message);
  // If signer is a private key, use it to sign
  // if (typeof signer === "string") {
  //   const privateKey = Buffer.from(signer.replace(/^0x/, ""), "hex");
  //   return ethSigUtil.signTypedMessage(privateKey, { data });
  // }

  // Otherwise, send the signTypedData RPC call
  // Note that hardhatvm and metamask require different EIP712 input
  // const isHardhat = data.domain.chainId == 31337;
  // const [method, argData] = ["eth_signTypedData_v4", JSON.stringify(data)];
  // const [method, argData] = ["eth_signTypedData_v4", data];
  const [method, argData] = ["eth_signTypedData", data];
  console.log(method, argData);
  //   ? ["eth_signTypedData", data]
  //   : ["eth_signTypedData_v4", JSON.stringify(data)];
  // return await signer.send(method, [from, argData]);
  // const domain = {
  //   name: "MinimalForwarder",
  //   version: "0.0.1",
  //   chainId: 11155420, // cadena correspondiente
  //   verifyingContract: "0xCE8ed3342e153C5E80c6c22c0c6D3EC7cf3Fb31C",
  // };

  // const types = {
  //   ForwardRequest: [
  //     { name: "from", type: "address" },
  //     { name: "to", type: "address" },
  //     { name: "value", type: "uint256" },
  //     { name: "gas", type: "uint256" },
  //     { name: "nonce", type: "uint256" },
  //     { name: "data", type: "bytes" },
  //   ],
  // };

  // const message = {
  //   from: "0xeF82D4C1073Edc2c49e7ea470b80f6E06da87B98",
  //   to: "0xCc1d6D42F1f966134059e077C540506B6F656960",
  //   value: 0,
  //   gas: 1000000,
  //   nonce: "0",
  //   data: "0xd204c45e000000000000000000000000ef82d4c1073edc2c49e7ea470b80f6e06da87b980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004d68747470733a2f2f697066732e6f70656e76696e6f2e6f72672f697066732f516d61745956366d626257686b3133666f447a6d4b586f557135486b4c316867615855325a4479514a367054695500000000000000000000000000000000000000",
  // };

  // Utiliza la función signTypedData para firmar el mensaje
  signer
    ._signTypedData(domain, types, message)
    .then((signature) => {
      console.log("Signature:", signature);
      return signature;
    })
    .catch((error) => {
      console.error("Error signing message:", error);
    });
  // return await signer._signTypedData(method, [from, JSON.stringify(data)]);
  // // return await signer._signTypedData(method, [from, argData]);
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
  const request = await buildRequest(forwarder, input);
  console.log(request);
  const toSign = await buildTypedData(forwarder, request);
  console.log(toSign);
  const signature = await signTypedData(signer, input.from, toSign);
  console.log(signature);
  return { signature, request };
}
