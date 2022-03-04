import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
  // Retrieve and deploy the PlutToken contract
  const PlutoToken = await ethers.getContractFactory("PlutoToken");
  const plutoToken = await PlutoToken.deploy(
    // Token capacity
    BigNumber.from(8888).mul(BigNumber.from(10).pow(18)),
    // Max mint per address
    BigNumber.from(8).mul(BigNumber.from(10).pow(18)),
    // Mint timeout per address
    24 * 60 * 60,
    // Max mint in a year
    BigNumber.from(888).mul(BigNumber.from(10).pow(18)),
    365 * 24 * 60 * 60
  );

  await plutoToken.deployed();

  console.log("PlutoToken deployed to:", plutoToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
