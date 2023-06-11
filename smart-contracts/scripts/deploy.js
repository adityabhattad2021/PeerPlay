const hre = require("hardhat");
const { verify } = require("../utils/verify");
const fs = require("fs");

async function main() {

  const PeerPlayTokenContract = await hre.ethers.getContractFactory("PeerPlayTokens");
  const peerPlayTokenContract = await PeerPlayTokenContract.deploy();

  await peerPlayTokenContract.deployed();
  console.log("---------------------------------------------");
  console.log(
    `peerPlayTokenContract with deployed to ${peerPlayTokenContract.address}`
  );
  console.log("---------------------------------------------");

  const PeerPlay = await hre.ethers.getContractFactory("PeerPlay");
  const peerPlay = await PeerPlay.deploy(peerPlayTokenContract.address);

  await peerPlay.deployed();
  console.log("---------------------------------------------");
  console.log(
    `PeerPlay with deployed to ${peerPlay.address}`
  );
  console.log("---------------------------------------------");

  console.log("-----------------Setting Required State in PeerPlayTokenContract------------------")
  const transectionResponse=await peerPlayTokenContract.setPlatformAddress(peerPlay.address);
  await transectionResponse.wait();
  console.log("----------------------------------Done---------------------------------")


  if(hre.network.name=="mumbai"){
    console.log("----------------------Trying to Verify the PeerPlay Contract----------------------");
    await verify(peerPlay.address, [peerPlayTokenContract.address])
    console.log("----------------------Verified the Contract Successfully----------------------");
    console.log("----------------------Trying to Verify the PeerPlayToken Contract----------------------");
    await verify(peerPlayTokenContract.address, [])
    console.log("----------------------Verified the Contract Successfully----------------------");
  }
  console.log("------------------Updating Frontend---------------------");
  fs.writeFileSync(
    '../frontend/constants/index.js',
    `export const peerplayAddress = "${peerPlay.address}"`
    )
    console.log("---------------------------Done-------------------------------");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
