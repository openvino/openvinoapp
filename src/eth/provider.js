/* eslint-disable no-unused-vars */
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
const MAIN_ENDPOINT = process.env.REACT_APP_MAIN_ENDPOINT;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
export function createProvider() {
  let provider = new ethers.providers.JsonRpcProvider(
    MAIN_ENDPOINT,
    Number(CHAIN_ID)
  );
  return provider;
}
