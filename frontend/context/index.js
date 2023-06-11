import axios from "axios";
import { useContext, createContext } from "react";
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import { peerplayABI, peerplayAddress } from "@/constants";

const StateContext = createContext();

export function StateContextProvider({ children }) {
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
        const cid = await client.put([file]);
        resolve(cid);
      } catch (error) {
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
        console.log("Error", err);
      }
    }
  }

  return (
    <StateContext.Provider
      value={{
        uploadToIpfsPromise,
        uploadVideoPromise,
        getVideoDetailsFunc
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
