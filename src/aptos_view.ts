import { aptos } from "./aptos_utils";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";
dotenv.config();

const APTOS_ACCOUNT = process.env.APTOS_ACCOUNT;
const APTOS_MODULE_NAME = process.env.APTOS_MODULE_NAME;

const viewModuleFunction = async (symbol: string) => {
  const payload: InputViewFunctionData = {
    function: `${APTOS_ACCOUNT}::${APTOS_MODULE_NAME}::get_token_price`, // ACCOUNT::MODULE::FUNCTION_NAME
    typeArguments: [],
    functionArguments: [`string:${symbol}`],
  };
  const output = await aptos.view({ payload });
  console.log(output);
};

viewModuleFunction("BTC");
viewModuleFunction("ETH");
viewModuleFunction("INDR");
