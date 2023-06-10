// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("Balloons", {
    
    from: deployer,
    log: true,
  });

  const balloons = await ethers.getContract("Balloons", deployer);

  await deploy("DEX", {

    from: deployer,
    args: [balloons.address],
    log: true,
    waitConfirmations: 5,
  });

  const dex = await ethers.getContract("DEX", deployer);

  console.log(
    "Approving DEX (" + dex.address + ") to take Balloons from main account..."
  );
 

  await balloons.approve(dex.address, ethers.utils.parseEther("100"));
  console.log("INIT...");
  await dex.init(ethers.utils.parseEther("30"), {
    value: ethers.utils.parseEther("0.3"),
    gasLimit: 200000,

    
  });
};
module.exports.tags = ["Balloons", "DEX"];
