import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";

async function expectRevert(promise: Promise<any>, reason?: string) {
  try {
    await promise;
    expect.fail("Expected promise to throw but it didn't");
  } catch (error: any) {
    if (reason) {
      expect(error.message).to.include(reason);
    }
  }
}

/*
 * Deploy the PlutoToken contract to a local in-memory chain and provide the Contract
 * API ready to call the PlutoToken public methods.
 */
async function deployPlutoToken(): Promise<Contract> {
  const PlutoToken = await ethers.getContractFactory("PlutoToken");
  // create a test token with a cap of 15 tokens, a max token x account of 8 and an interval between mints of 4 seconds
  const token = await PlutoToken.deploy(plt(15), plt(8), 4);
  await token.deployed();
  return token;
}

/*
 * Return a * 10^18 as a BigNumber
 */
function plt(a: number): BigNumber {
  return BigNumber.from(a).mul(BigNumber.from(10).pow(18));
}

describe("PlutoToken", () => {
  it("has total supply", async () => {
    const token = await deployPlutoToken();
    expect(await token.totalSupply()).to.equal(ethers.BigNumber.from("0"));
  });

  it("has cap", async () => {
    const token = await deployPlutoToken();
    expect(await token.cap()).to.equal(
      ethers.BigNumber.from("15000000000000000000")
    );
  });

  it("can mint", async () => {
    const [, addr1] = await ethers.getSigners();
    const token = await deployPlutoToken();

    const token1 = token.connect(addr1);

    const mintTx = await token1.mint(plt(7));
    await mintTx.wait(); // wait for mined

    expect(await token1.balanceOf(await addr1.getAddress())).to.equal(plt(7));
  });

  it("can not mint twice without wating for the minMintInterval", async () => {
    const [, addr1] = await ethers.getSigners();
    const token = await deployPlutoToken();

    const token1 = token.connect(addr1);

    const mint1Tx = await token1.mint(plt(3));
    await mint1Tx.wait(); // wait for mined

    await expectRevert(
      token1.mint(plt(4)),
      "PlutoToken: you need to wait before you can mint again"
    );

    expect(await token1.balance()).to.equal(plt(3));
  });

  it("can mint again after wating for the interval", async () => {
    const [, addr1] = await ethers.getSigners();
    const token = await deployPlutoToken();

    const token1 = token.connect(addr1);

    // wait for the request and for it to be mint
    await await token1.mint(plt(3));

    // wait 5 seconds before mint again
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

    await await token1.mint(plt(3));

    expect(await token1.balance()).to.equal(plt(6));
  });

  it("can not mint more than the max mint in a single time", async () => {
    const [, addr1] = await ethers.getSigners();
    const token = await deployPlutoToken();

    const token1 = token.connect(addr1);

    await expectRevert(
      token1.mint(plt(9)),
      "PlutoToken: amount exceed the maximum allowed amount"
    );

    expect(await token1.balance()).to.equal(plt(0));
  });

  it("can not mint more than the max mint in two times", async () => {
    const [, addr1] = await ethers.getSigners();
    const token = await deployPlutoToken();

    const token1 = token.connect(addr1);

    // wait for the request and for it to be mint
    await await token1.mint(plt(5));

    // wait 5 seconds before mint again
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

    await expectRevert(
      token1.mint(plt(4)),
      "PlutoToken: amount exceed the maximum allowed amount"
    );

    expect(await token1.balance()).to.equal(plt(5));
  });

  it("can not mint more than the cap", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    const token = await deployPlutoToken();

    const token1 = token.connect(addr1);

    // wait for the request and for it to be mint
    await await token1.mint(plt(8));

    const token2 = token.connect(addr2);
    await expectRevert(token2.mint(plt(8)), "ERC20Capped: cap exceeded");
  });
});
