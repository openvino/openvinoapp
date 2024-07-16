// import { ethers } from "ethers";
// import { Web3Auth } from "@web3auth/modal";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";

// const clientId =
//   "BAW5bwK0f0-pUV4_owkK8z1l6_0TbXex43P-94Oa6fCke4Js8ZQ7OLClu7jHGCe7Z5hRCtRNyLZiT1hfAMWwkfE";

// const chainConfig = {
//   chainNamespace: "eip155",
//   chainId: "0xaa37dc",
//   rpcTarget: "https://sepolia.optimism.io",
//   displayName: "Optimism Sepolia",
//   blockExplorer: "https://sepolia-optimism.etherscan.io",
//   ticker: "OP",
//   tickerName: "OP",
//   logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
// };

// const privateKeyProvider = new EthereumPrivateKeyProvider({
//   config: { chainConfig: chainConfig },
// });

// const web3auth = new Web3Auth({
//   clientId,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//   chainConfig: chainConfig,
//   privateKeyProvider: privateKeyProvider,
// });

// async function initializeAndConnect() {
//   try {
//     await web3auth.initModal();
//     console.log("Web3Auth initialized", web3auth.status);

//     if (web3auth.status === "connected") {
//       console.log("Already connected");
//     } else {
//       // Esto abrirá el modal de conexión
//       const connectResult = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN);
//       console.log("Connected", connectResult);
//     }

//     // Acciones después de la conexión exitosa
//     const user = await web3auth.getUserInfo();
//     console.log("User info:", user);

//     const provider = new ethers.providers.Web3Provider(web3auth.provider);
//     console.log("Provider:", provider);
//     const signer = await provider.getSigner();
//     const address = await signer.getAddress();
//     console.log("User's address:", address);
//   } catch (error) {
//     console.error("Error during initialization or connection:", error);
//   }
// }

// initializeAndConnect();
