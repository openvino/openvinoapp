import { ethers } from "ethers";
import { Registry as address } from "./deploy.json";
import NFTContractBuild from "../contract/YDIYOI.json";

const abi = NFTContractBuild.abi;

export function createInstance(provider) {
  return new ethers.Contract(address, abi, provider);
}
