const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  it("Should store and return value", async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const storage = await SimpleStorage.deploy();
    await storage.waitForDeployment();

    expect(await storage.get()).to.equal(0);

    await storage.set(42);
    expect(await storage.get()).to.equal(42);

    await storage.set(100);
    expect(await storage.get()).to.equal(100);
  });
});
