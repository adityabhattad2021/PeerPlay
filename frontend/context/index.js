import axios from "axios";
import { useContext, createContext, useState } from "react";
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import { peerplayABI, peerplayAddress } from "@/constants";

const StateContext = createContext();

export function StateContextProvider({ children }) {
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [keyword, setKeyword] = useState("");

  async function uploadToIpfsPromise(file) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!file) {
          reject("No File to Upload");
          return;
        }
        const client = new Web3Storage({
          token: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY,
        });
        const blob = file.slice(0, file.size, "image/png");
        const forIPFS = new File([blob], "thumbnail.png", {
          type: "image/png",
        });
        const cid = await client.put([forIPFS]);
        resolve(cid);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async function uploadVideoPromise(video, title) {
    return new Promise(async (resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(video);

      reader.onloadend = async () => {
        try {
          let videoData = Buffer.from(reader.result);
          let instance = axios.create({
            baseURL: "https://livepeer.com/api/",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
            },
          });

          let response = await instance.post("asset/request-upload", {
            name: title,
          });

          let assetId = response.data.asset.id;
          console.log("Done URL generation");
          console.log(response);

          let uploadResponse = await axios({
            method: "put",
            url: response.data.url,
            data: videoData,
            headers: { "Content-Type": "video/mp4" },
          });

          console.log("Done Video Upload");
          console.log(uploadResponse);

          resolve(assetId);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      };
    });
  }

  // Smart Contract Call
  async function getVideoDetailsFunc(videoId) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const res = await contract.getVideoDetails(videoId);
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  async function checkIfUserHasMintedVideo(videoId) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const res = await contract.checkIfAccessToVideo(videoId);
        console.log("res is ", res);
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  async function checkIfSupporterFunc(creator) {
    console.log(creator);
    if (typeof window.ethereum !== "undefined" && !(creator === undefined)) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const res = await contract.checkIfSupporter(creator);
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  async function getUserMintedVideos() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const res = await contract.getUserMintedVideos();
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  async function uploadVideo(
    videoTitle,
    videoDescription,
    videoAssetId,
    videoCid,
    price
  ) {
    const videoPrice = ethers.utils.parseEther(price);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const gasEstimate = await contract.estimateGas.uploadVideo(
          videoTitle,
          videoDescription,
          videoAssetId,
          videoCid,
          videoPrice
        );
        const res = await contract.uploadVideo(
          videoTitle,
          videoDescription,
          videoAssetId,
          videoCid,
          videoPrice,
          {
            gasLimit: gasEstimate,
          }
        );
        return res;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function mintVideoNFT(videoId, videoPrice) {
    const formattedPrice = ethers.utils.formatEther(videoPrice.toString());
    console.log(formattedPrice);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const gasEstimate = await contract.estimateGas.mintAccessNFTForVideo(
          videoId,
          {
            value: ethers.utils.parseEther(formattedPrice),
          }
        );
        const res = await contract.mintAccessNFTForVideo(videoId, {
          value: ethers.utils.parseEther(formattedPrice),
          gasLimit: gasEstimate,
        });
        await res.wait();
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  async function supportCreator(creatorAddress, supportPrice) {
    const formattedPrice = ethers.utils.formatEther(supportPrice.toString());
    console.log(formattedPrice);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const gasLimit = 50000; // Set a reasonable gas limit value
        const res = await contract.supportCreator(creatorAddress, {
          value: ethers.utils.parseEther(formattedPrice).toString(),
          gasLimit: gasLimit,
        });
        await res.wait();
        console.log(res);
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  async function fetchImageWithRateLimitHandling(randomNumber) {
    try {
      const api = "https://api.multiavatar.com";
      const image = await axios.get(`${api}/${randomNumber}`);
      return image;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // 429 status code indicates rate limit exceeded
        // Wait for a certain period (e.g., 5 seconds) before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return fetchImageWithRateLimitHandling();
      } else {
        throw error;
      }
    }
  }

  async function withdrawCreatorRevenueFunc() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const res = await contract.withdrawCreatorRevenue();
        await res.wait();
        console.log(res);
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }
  async function withdrawSupporterRevenueFunc() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        peerplayAddress,
        peerplayABI,
        signer
      );
      try {
        const res = await contract.withdrawSupporterRevenue();
        await res.wait();
        console.log(res);
        return res;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }

  return (
    <StateContext.Provider
      value={{
        uploadToIpfsPromise,
        uploadVideoPromise,
        getVideoDetailsFunc,
        checkIfSupporterFunc,
        fetchImageWithRateLimitHandling,
        mintVideoNFT,
        checkIfUserHasMintedVideo,
        uploadVideo,
        supportCreator,
        getUserMintedVideos,
        withdrawCreatorRevenueFunc,
        withdrawSupporterRevenueFunc,
        searchedVideos,
        setSearchedVideos,
        keyword,
        setKeyword,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
