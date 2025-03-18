import dotenv from "dotenv";
import {
  Ed25519PrivateKey,
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";
dotenv.config();
const APTOS_PRIVATE_KEY = process.env.APTOS_PRIVATE_KEY || "";
if (!APTOS_PRIVATE_KEY) {
  throw new Error("Missing required environment variables");
}

const APTOS_NETWORK: Network = NetworkToNetworkName[Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const getSigner = async () => {
  const privateKey = new Ed25519PrivateKey(APTOS_PRIVATE_KEY as string);
  const signer = await aptos.deriveAccountFromPrivateKey({ privateKey });
  return signer;
};

export { getSigner, aptos };
