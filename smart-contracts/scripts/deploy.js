const hre = require("hardhat");
const { verify } = require("../utils/verify");
const fs = require("fs");

async function main() {

  const PeerPlay = await hre.ethers.getContractFactory("PeerPlay");
  const peerPlay = await PeerPlay.deploy();

  await peerPlay.deployed();
  console.log("---------------------------------------------");
  console.log(
    `PeerPlay with deployed to ${peerPlay.address}`
  );
  console.log("---------------------------------------------");
  if(hre.network.name=="mumbai"){
    console.log("----------------------Trying to Verify the contract----------------------");
    await verify(peerPlay.address, [])
    console.log("----------------------Verified the Contract Successfully----------------------");
  }

  fs.writeFileSync(
    '../frontend/constants/index.js',
    `export const peerplayAddress = "${peerPlay.address}"`
  )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
