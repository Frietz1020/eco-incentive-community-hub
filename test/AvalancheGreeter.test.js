const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AvalancheGreeter", function () {
  it("Should set and get greeting", async function () {
    const Greeter = await ethers.getContractFactory("AvalancheGreeter");
    const greeter = await Greeter.deploy("Hello, Avalanche!");
    await greeter.waitForDeployment();

    expect(await greeter.getGreeting()).to.equal("Hello, Avalanche!");
    expect(await greeter.greeting()).to.equal("Hello, Avalanche!");
    expect(await greeter.owner()).to.equal((await ethers.getSigners())[0].address);
  });

  it("Should allow owner to set new greeting", async function () {
    const [owner] = await ethers.getSigners();
    const Greeter = await ethers.getContractFactory("AvalancheGreeter");
    const greeter = await Greeter.deploy("Hi");
    await greeter.waitForDeployment();

    await greeter.connect(owner).setGreeting("New greeting");
    expect(await greeter.getGreeting()).to.equal("New greeting");
  });

  it("Should reject setGreeting from non-owner", async function () {
    const [, other] = await ethers.getSigners();
    const Greeter = await ethers.getContractFactory("AvalancheGreeter");
    const greeter = await Greeter.deploy("Hi");
    await greeter.waitForDeployment();

    await expect(greeter.connect(other).setGreeting("Hack")).to.be.revertedWith(
      "Only owner can set greeting"
    );
  });
});
