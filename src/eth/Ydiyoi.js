import { ethers } from "ethers";
import deploy from "./deploy.json"; // Asegúrate de que el archivo se llama deploy.json
import NFTContractBuild from "../contract/YDIYOI.json";

const abi = NFTContractBuild.abi;
const address = deploy.Registry; // Accede a la propiedad Registry

export function createInstance(provider) {
  return new ethers.Contract(address, abi, provider);
}
