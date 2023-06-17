"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import * as PushAPI from "@pushprotocol/restapi";
import { produce } from "immer";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";
import { ADDITIONAL_META_TYPE } from "@pushprotocol/restapi/src/lib/payloads/constants";
import VideoPlayer from "@/components/VideoPlayer";
import { Box } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SwipeRightAltIcon from "@mui/icons-material/SwipeRightAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import VideocamIcon from "@mui/icons-material/Videocam";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import { usePushSocket } from "@/push-helpers/push-video/hooks/usePushSocket";

const env = ENV.STAGING;

export default function Video() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [signer, setSigner] = useState();
  const searchParams = useSearchParams();
  const creatorAddress = searchParams.get("creatorAddress");

  const { pushSocket, isPushSocketConnected, latestFeedItem } = usePushSocket({
    env,
  });

  const videoObjectRef = useRef();
  const recipientAddressRef = useRef(null);
  const chatIdRef = useRef(null);

  const [data, setData] = useState(PushAPI.video.initVideoCallData);

  async function setRequestVideoCall() {
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft) => {
        if (!recipientAddressRef || !recipientAddressRef.current) return;
        if (!chatIdRef || !chatIdRef.current) return;

        draft.local.address = address;
        draft.incoming[0].address = recipientAddressRef.current.value;
        draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
        draft.meta.chatId = chatIdRef.current.value;
      });
    });

    await videoObjectRef.current?.create({ video: true, audio: true });
  }

  async function setIncomingVideoCall(videoCallMetaData) {
    // update the video call 'data' state with the incoming call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = videoCallMetaData.recipientAddress;
        draft.incoming[0].address = videoCallMetaData.senderAddress;
        draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
        draft.meta.chatId = videoCallMetaData.chatId;
        draft.meta.initiator.address = videoCallMetaData.senderAddress;
        draft.meta.initiator.signal = videoCallMetaData.signalData;
      });
    });

    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
  }

  async function acceptVideoCallRequest() {
    if (!data.local.stream) return;

    await videoObjectRef.current?.acceptRequest({
      signalData: data.meta.initiator.signal,
      senderAddress: data.local.address,
      recipientAddress: data.incoming[0].address,
      chatId: data.meta.chatId,
    });
  }

  async function connectHandler(videoCallMetaData) {
    videoObjectRef.current?.connect({
      signalData: videoCallMetaData.signalData,
    });
  }

  useEffect(() => {
    recipientAddressRef.current = creatorAddress;
    chatIdRef.current = creatorAddress;
  }, [creatorAddress]);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      if (!signer || !address || !chain?.id) return;

      (async () => {
        const user = await PushAPI.user.get({
          account: address,
          env: "staging",
        });
        let pgpPrivateKey = null;
        if (user?.encryptedPrivateKey) {
          pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: user.encryptedPrivateKey,
            account: address,
            signer: signer,
            env: "staging",
          });
        }

        videoObjectRef.current = new PushAPI.video.Video({
          signer: signer,
          chainId: chain.id,
          pgpPrivateKey,
          env: "staging",
          setData,
        });
      })();
    }
  }, [signer, address, chain]);

  useEffect(() => {
    (async () => {
      const currentStatus = data.incoming[0].status;
      if (
        data.local.stream &&
        currentStatus === PushAPI.VideoCallStatus.INITIALIZED
      ) {
        await videoObjectRef.current?.request({
          senderAddress: data.local.address,
          recipientAddress: data.incoming[0].address,
          chatId: data.meta.chatId,
        });
      }
    })();
  }, [data.incoming, data.local.address, data.local.stream, data.meta.chatId]);

  useEffect(() => {
    if (!pushSocket?.connected) {
      pushSocket?.connect();
    }
  }, [pushSocket]);

  useEffect(() => {
    if (!isPushSocketConnected || !latestFeedItem) return;

    const { payload } = latestFeedItem || {};

    if (
      !Object.prototype.hasOwnProperty.call(payload, "data") ||
      !Object.prototype.hasOwnProperty.call(payload["data"], "additionalMeta")
    ) {
      return;
    }

    const additionalMeta = payload["data"]["additionalMeta"];
    console.log("RECEIVED ADDITIONAL META", additionalMeta);
    if (!additionalMeta) return;

    console.log(additionalMeta.type);

    // check for PUSH_VIDEO
    if (additionalMeta.type !== `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`) return;
    const videoCallMetaData = JSON.parse(additionalMeta.data);
    console.log("RECIEVED VIDEO DATA", videoCallMetaData);

    if (videoCallMetaData.status === PushAPI.VideoCallStatus.INITIALIZED) {
      setIncomingVideoCall(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RECEIVED ||
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
    ) {
      connectHandler(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.DISCONNECTED
    ) {
      window.location.reload();
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.request({
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      !videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.acceptRequest({
        signalData: videoCallMetaData.signalingData,
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    }
  }, [latestFeedItem]);

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        height: { sx: "calc(100vh - 80px)", md: "calc(83vh)" },
        marginLeft: { sx: 0, md: "13%" },
        marginTop: { sx: "80px", md: 0 },
        px: { sx: 2, md: 4 },
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "80%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            width: "73%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            <h2 style={{ color: "white" }}>Incoming Video</h2>
            <VideoPlayer
              className={"incoming-video-plyr"}
              stream={data.incoming[0].stream}
              isMuted={false}
            />
          </div>
        </Box>
        <Box>
          <h1 style={{ color: "white" }}>
            Video Call Status: {data.incoming[0].status}
          </h1>
          <Box>
            <p style={{ color: "white" }}>
              LOCAL VIDEO: {data.local.video ? "TRUE" : "FALSE"}
            </p>
            <p style={{ color: "white" }}>
              LOCAL AUDIO: {data.local.audio ? "TRUE" : "FALSE"}
            </p>
            <p style={{ color: "white" }}>
              INCOMING VIDEO: {data.incoming[0].video ? "TRUE" : "FALSE"}
            </p>
            <p style={{ color: "white" }}>
              INCOMING AUDIO: {data.incoming[0].audio ? "TRUE" : "FALSE"}
            </p>
          </Box>
          <Box
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            <h2 style={{ color: "white" }}>Local Video</h2>
            <VideoPlayer
              className={"outgoing-video-plyr"}
              stream={data.local.stream}
              isMuted={true}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-around",
          height: "10%",
          mt: "44px",
        }}
      >
        <button
          className="video-btn"
          disabled={
            data.incoming[0].status !== PushAPI.VideoCallStatus.UNINITIALIZED
          }
          onClick={setRequestVideoCall}
        >
          <SendOutlinedIcon />
        </button>

        <button
          className="video-btn"
          disabled={
            data.incoming[0].status !== PushAPI.VideoCallStatus.RECEIVED
          }
          onClick={acceptVideoCallRequest}
        >
          <SwipeRightAltIcon />
        </button>

        <button
          className="video-btn"
          disabled={
            data.incoming[0].status === PushAPI.VideoCallStatus.UNINITIALIZED
          }
          onClick={() => videoObjectRef.current?.disconnect()}
        >
          <CancelIcon />
        </button>

        <button
          className="video-btn"
          disabled={
            data.incoming[0].status === PushAPI.VideoCallStatus.UNINITIALIZED
          }
          onClick={() =>
            videoObjectRef.current?.enableVideo({
              state: !data.local.video,
            })
          }
        >
          <VideocamIcon />
        </button>

        <button
          className="video-btn"
          disabled={
            data.incoming[0].status === PushAPI.VideoCallStatus.UNINITIALIZED
          }
          onClick={() =>
            videoObjectRef.current?.enableAudio({
              state: !data.local.audio,
            })
          }
        >
          <SpatialAudioOffIcon />
        </button>
      </Box>
    </Box>
  );
}
