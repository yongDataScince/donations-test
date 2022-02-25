const { ethers } = require("hardhat");

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Donations = await ethers.getContractFactory("Donations");
  const donations = await Donations.deploy();

  await donations.deployed();
  console.log("Contract address:", donations.address);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1)
  })
