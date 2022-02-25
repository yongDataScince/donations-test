const getContract = async (
  name = "Donations",
  addr = "0x178AA62CdaA6532c989a8ac1b41f1bB46Eeecd12"
) => {
  const Token = await ethers.getContractFactory(name);
  return await Token.attach(addr, ethers.provider);
};

task("donate")
  .addParam("value", "Eth value for donate")
  .setAction(async ({ value }) => {
    const contract = await getContract();
    await contract.donate({ value: ethers.utils.parseEther(value) });
  });

task("withdraw", "withdraw all funds")
  .addParam("address", "address where to withdraw funds")
  .addParam("value", "Eth value for withdraw funds")
  .setAction(async ({ address, value }) => {
    const contract = await getContract();
    await contract.withdraw(address, ethers.utils.parseEther(value));
  });

task("value", "the sum of all donations to a certain address")
  .addParam("address")
  .setAction(async ({ address }) => {
    const contract = await getContract();
    const res = await contract.getDonaterAmount(address);
    const answer = `user ${address.slice(
      0,
      14
    )}... donated ${ethers.utils.formatEther(res)} ETH`;
    console.log(answer);
  });

task("donaters", "get all donaters").setAction(async () => {
  const contract = await getContract();
  const res = await contract.getDonaters();
  res?.forEach((b, idx) => console.log(`${idx + 1}: ${b}`));
});

task("cnt-balance", async () => {
  const contract = await getContract();
  const res = await ethers.provider.getBalance(contract.address);
  console.log(ethers.utils.formatEther(res) + " ETH");
});
