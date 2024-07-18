import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";

const clientId =
  "BAW5bwK0f0-pUV4_owkK8z1l6_0TbXex43P-94Oa6fCke4Js8ZQ7OLClu7jHGCe7Z5hRCtRNyLZiT1hfAMWwkfE";
// const clientId =
//   "BFI8C9qKjt-WCdLsGgJLwnfL_J2Nt2xNlfbVhALMf7KHvQW6BQlQpl23W2k4rJUUQA4WCoAeJqj0J6pV-DFW_Tw";

const chainConfig = {
  chainNamespace: "eip155",
  chainId: "0xaa37dc",
  rpcTarget: "https://sepolia.optimism.io",

  displayName: "Optimism Sepolia",
  blockExplorer: "https://sepolia-optimism.etherscan.io",
  ticker: "OP",
  tickerName: "OP",
  logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig: chainConfig,
  privateKeyProvider: privateKeyProvider,
});

export function useWebWallet() {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const initializeWeb3Auth = useCallback(async () => {
    try {
      await web3auth.initModal();
      setIsInitialized(true);
      console.log("Web3Auth initialized", web3auth.status);
    } catch (error) {
      console.error("Error initializing Web3Auth:", error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!isInitialized) {
      console.error("Web3Auth is not initialized");
      return;
    }
    try {
      const connectResult = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN);
      console.log("Connected", connectResult);
      setIsConnected(true);
      await updateUserInfo();
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }, [isInitialized]);

  const updateUserInfo = useCallback(async () => {
    if (!isConnected) return;

    const userInfo = await web3auth.getUserInfo();
    setUser(userInfo);

    const ethersProvider = new ethers.providers.Web3Provider(web3auth.provider);
    setProvider(ethersProvider);

    const ethersSigner = ethersProvider.getSigner();
    setSigner(ethersSigner);

    const userAddress = await ethersSigner.getAddress();
    setAddress(userAddress);

    console.log("User info:", userInfo);
    console.log("User's signer:", ethersSigner);
    console.log("User's address:", userAddress);
  }, [isConnected]);

  const disconnect = useCallback(async () => {
    if (web3auth) {
      await web3auth.logout();
      setUser(null);
      setAddress(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    initializeWeb3Auth();
  }, [initializeWeb3Auth]);

  useEffect(() => {
    if (isInitialized && web3auth.status === "connected") {
      setIsConnected(true);
      updateUserInfo();
    }
  }, [isInitialized, updateUserInfo]);

  return {
    webWalletUser: user,
    webWalletAddress: address,
    webWalletProvider: provider,
    webWalletSigner: signer,
    webWalletIsInitialized: isInitialized,
    webWalletIsConnected: isConnected,
    connectWebWallet: connect,
    disconnectWebWallet: disconnect,
    updateWebWalletUserInfo: updateUserInfo,
  };
}
