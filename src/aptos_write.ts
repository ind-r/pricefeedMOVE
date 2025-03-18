import { getSigner, aptos } from "./aptos_utils";
import dotenv from "dotenv";
dotenv.config();

const APTOS_ACCOUNT = process.env.APTOS_ACCOUNT;
const APTOS_MODULE_NAME = process.env.APTOS_MODULE_NAME;

if (!APTOS_ACCOUNT || !APTOS_MODULE_NAME) {
  throw new Error("Missing required environment variables");
}

const writeModuleFunction = async (lastPrice: string, symbol: string) => {
  const signer = await getSigner();
  const txn = await aptos.transaction.build.simple({
    sender: signer.accountAddress,
    data: {
      function: `${APTOS_ACCOUNT}::${APTOS_MODULE_NAME}::update_feed`, // ACCOUNT::MODULE::FUNCTION_NAME
      typeArguments: [],
      functionArguments: [lastPrice, `string:${symbol}`],
    },
  });
  const commitedTxn = await aptos.signAndSubmitTransaction({
    signer: signer,
    transaction: txn,
  });

  await aptos.waitForTransaction({
    transactionHash: commitedTxn.hash,
  });

  console.log(`Transaction committed: ${commitedTxn.hash}\n`);
};

writeModuleFunction("3452", "INDR");
