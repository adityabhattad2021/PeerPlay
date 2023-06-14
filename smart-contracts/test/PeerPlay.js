const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {ethers}=require("hardhat");
const { expect } = require("chai");

describe("PeerPlay", function () {
  async function deployPeerPlayFixture() {
    const deployer = await ethers.getSigner();

    const PeerPlayTokenContract = await ethers.getContractFactory("PeerPlayTokens");
    const peerplayTokenContract = await PeerPlayTokenContract.deploy();
    console.log(peerplayTokenContract.address);
    const PeerPlay = await ethers.getContractFactory("PeerPlay");
    const peerplay = await PeerPlay.deploy(peerplayTokenContract.address);
    const transectionResponse = await peerplayTokenContract.setPlatformAddress(peerplay.address);
    await transectionResponse.wait();
    return { peerplay,deployer };
  }

  describe("Deployment", function () {

    it("Deploy Correctly", async function () {
      const { peerplay} = await loadFixture(deployPeerPlayFixture);
    });

    it("Should set the right owner", async function () {
      const { peerplay,deployer} = await loadFixture(deployPeerPlayFixture);

      expect(await peerplay.owner()).to.equal(deployer.address);
    });   

  });

  describe("Core Functionality", function () {

    it("Should allow users to upload videos", async function () {
      const { peerplay,deployer} = await loadFixture(deployPeerPlayFixture);
    
      // upload a video
      const title = "Test Video";
      const description = "This is a test video";
      const livepeerId = "livepeerId";
      const thumbnailHash = "thumbnailhash";
      const videoPrice = ethers.utils.parseEther("1");
      const tx = await peerplay.connect(deployer).uploadVideo(title, description, livepeerId, thumbnailHash, videoPrice);
      await tx.wait();
    
      // check the video details
      const videoCount = await peerplay.getVideoCount();
      const video = await peerplay.getVideoDetails(videoCount);
      expect(video.title).to.equal(title);
      expect(video.description).to.equal(description);
      expect(video.livepeerId).to.equal(livepeerId);
      expect(video.thumbnailHash).to.equal(thumbnailHash);
      expect(video.videoPrice).to.equal(videoPrice);
    });

    it("Should support a creator by sending ETH", async function () {
      const [owner, supporter, creator] = await ethers.getSigners();
    
      const { peerplay} = await loadFixture(deployPeerPlayFixture);
 
      const supportPrice = await peerplay.calculateSupportPrice(creator.address);
      console.log(supportPrice);
    
      const tx = await peerplay.connect(supporter).supportCreator(creator.address, { value: supportPrice });
      await tx.wait();
    
      const supportersList = await peerplay.getSupportersList(creator.address);
      expect(supportersList).to.include(supporter.address);
    });
  });
  
});
