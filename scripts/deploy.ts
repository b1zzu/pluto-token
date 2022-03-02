import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
  // Retrieve and deploy the PlutToken contract
  const PlutoToken = await ethers.getContractFactory("PlutoToken");
  const plutoToken = await PlutoToken.deploy(
    BigNumber.from(8888).mul(BigNumber.from(10).pow(18)),
    ethers.BigNumber.from(8).mul(ethers.BigNumber.from(10).pow(18)),
    24 * 60 * 60
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
