const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donations", () => {
  let Donations, donations, owner, addr1, addr2, addr3, addr4, addr5;

  beforeEach(async function () {
    Donations = await ethers.getContractFactory("Donations");
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    donations = await Donations.deploy();
  });

  it("check donate", async () => {
    await donations
      .connect(addr1)
      .donate({ value: ethers.utils.parseEther("5") });

    await donations
      .connect(addr1)
      .donate({ value: ethers.utils.parseEther("5") });

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("5") });

    expect(await ethers.provider.getBalance(donations.address)).to.eql(
      ethers.utils.parseEther("15")
    );

    expect(await donations.getDonaterAmount(addr1.address)).to.eql(
      ethers.utils.parseEther("10")
    );

    expect(await donations.getDonaterAmount(addr2.address)).to.eql(
      ethers.utils.parseEther("5")
    );
  });

  it("check withdraw", async () => {
    await donations
      .connect(addr1)
      .donate({ value: ethers.utils.parseEther("1") });

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("9") });

    expect(
      await donations
        .connect(owner)
        .withdraw(addr5.address, ethers.utils.parseEther("10"))
    );
    expect(await ethers.provider.getBalance(donations.address)).to.equal("0");

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("12") });

    await expect(
      donations
        .connect(owner)
        .withdraw(addr5.address, ethers.utils.parseEther("20"))
    ).to.be.revertedWith("Not enough tokens");

    await expect(
      donations
        .connect(addr1)
        .withdraw(addr5.address, ethers.utils.parseEther("12"))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Check balances", async () => {
    await donations
      .connect(addr1)
      .donate({ value: ethers.utils.parseEther("0.1") });

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("19") });

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("1.38") });

    await donations
      .connect(addr3)
      .donate({ value: ethers.utils.parseEther("7") });

    await donations
      .connect(addr4)
      .donate({ value: ethers.utils.parseEther("15") });

    expect(await ethers.provider.getBalance(donations.address)).to.eql(
      ethers.utils.parseEther("42.48")
    );

    expect(await donations.getDonaterAmount(addr2.address)).to.eql(
      ethers.utils.parseEther("20.38")
    );
  });

  it("Check unique addrs", async () => {
    await donations
      .connect(addr3)
      .donate({ value: ethers.utils.parseEther("0.34") });

    await donations
      .connect(addr1)
      .donate({ value: ethers.utils.parseEther("0.1") });

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("19") });

    await donations
      .connect(addr2)
      .donate({ value: ethers.utils.parseEther("1.38") });

    await donations
      .connect(addr3)
      .donate({ value: ethers.utils.parseEther("7") });

    await donations
      .connect(addr4)
      .donate({ value: ethers.utils.parseEther("15") });

    await donations
      .connect(addr1)
      .donate({ value: ethers.utils.parseEther("0.8") });

    expect(await donations.getDonaters()).to.length(4);
  });
});
