import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { BigNumber } from "ethers";

dotenv.config();

function toPLT(a: number): BigNumber {
  return BigNumber.from(a).mul(BigNumber.from(10).pow(18));
}

function fromPLT(a: BigNumber): BigNumber {
  return a.div(BigNumber.from(10).pow(18));
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("mint", "Mint PlutTokens for the account")
  .addParam("account", "The account address")
  .addParam("contract", "The PlutToken contract address")
  .addPositionalParam("amount", "The amount of tokens to mint")
  .setAction(async (taskArgs, hre) => {
    const provider = new hre.ethers.providers.JsonRpcProvider();
    const wallet = new hre.ethers.Wallet(taskArgs.account, provider);
    const artifact = await hre.artifacts.readArtifact("PlutoToken");
    const contract = new hre.ethers.Contract(
      taskArgs.contract,
      artifact.abi,
      wallet
    );

    await await contract.mint(toPLT(taskArgs.amount));
    console.log("PlutTokens Balance: " + fromPLT(await contract.balance()));
  });

task("balance", "Prints the PlutTokens account balance")
  .addParam("account", "The account address")
  .addParam("contract", "The PlutToken contract address")
  .setAction(async (taskArgs, hre) => {
    const provider = new hre.ethers.providers.JsonRpcProvider();
    const wallet = new hre.ethers.Wallet(taskArgs.account, provider);
    const artifact = await hre.artifacts.readArtifact("PlutoToken");
    const contract = new hre.ethers.Contract(
      taskArgs.contract,
      artifact.abi,
      wallet
    );

    console.log("PlutTokens Balance: " + fromPLT(await contract.balance()));
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
