"use client";
import CustomButton from "@/components/CustomButton";
import { Box, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useAccount, useNetwork } from "wagmi";
import { useSearchParams } from "next/navigation";
import {
  createUserIfNecessary,
  getChats,
} from "@/push-helpers/push-chat/helpers/chat";
import { walletToPCAIP10 } from "@/push-helpers/push-chat/helpers/address";
import { usePushSocketForChat } from "@/push-helpers/push-chat/hooks/useSDKSocket";
import { usePushSocket } from "@/push-helpers/push-video/hooks/usePushSocket";


function MessageLeft({ text }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        my: "10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#289935",
          px: "15px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h4>{text}</h4>
      </Box>
    </Box>
  );
}

function MessageRight({ text }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        my: "10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#289935",
          px: "15px",
          color: "white",
          borderRadius: "20px",
        }}
      >
        <h4>{text}</h4>
      </Box>
    </Box>
  );
}

function SendMessage({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSend(message);
    setMessage("");
  };

  return (
    <>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="filled"
        sx={{
          width: "95%",
          height: "95%",
          mr: "15px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          p:"5px"
        }}
      />
      <CustomButton text="Sent" onClick={() => handleSubmit()} />
    </>
  );
}

const env = "staging";

export default function Chat() {
  const searchParams = useSearchParams();

  const creatorAddress = searchParams.get("creatorAddress");
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const dummy = useRef();
  const [chats, setChats] = useState();
  const [connectedUser, setConnectedUser] = useState();
  const [signer,setSigner] = useState();
  const { pushSocket, isPushSocketConnected, latestFeedItem } = usePushSocket({
    env,
  });

  async function handlePushSendMessage(message) {
    try {
      if (message.trim() !== '' && connectedUser && signer) {
        console.log("sending message inside");
        const pCAIP10recieverAccount = walletToPCAIP10(creatorAddress);
        const sendResponse = await PushAPI.chat.send({
          messageContent: message,
          messageType: 'Text',
          receiverAddress: pCAIP10recieverAccount,
          pgpPrivateKey: connectedUser?.privateKey,
          signer:signer,
          env,
        });
        console.log(sendResponse);
        getChatCall()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getConnectedUserCall() {
    if (!isConnected) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    if (!provider) return;
    const signer = provider.getSigner();
    setSigner(signer)
    const pCAIP10account = walletToPCAIP10(address);
    try{
      const cUser = await createUserIfNecessary({
        account: pCAIP10account,
        signer,
      });
      setConnectedUser(cUser);
    }catch(error){
      console.log(error);
    }
  }

  async function getChatCall() {
    if (!isConnected) return;
    if (!connectedUser) return;
    const pCAIP10account = walletToPCAIP10(address);
    try{
      const { chatsResponse, lastThreadHash, lastListPresent } = await getChats({
        account: pCAIP10account,
        pgpPrivateKey: connectedUser.privateKey,
        creatorAddress,
        env,
      });
      const reversed = chatsResponse.reverse();
      setChats([...reversed]);
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    getConnectedUserCall();
  }, []);

  useEffect(() => {
    getChatCall();
  }, [connectedUser]);

  useEffect(() => {
    if (!pushSocket?.connected) {
      pushSocket?.connect();
    }
  }, [pushSocket]);

  useEffect(() => {
    if (!isPushSocketConnected || !latestFeedItem) return;
    getChatCall()
  }, [latestFeedItem]);


  return (
    <Box
      p={2}
      sx={{
        width: "95%",
        height: { sx: "calc(100vh - 80px)", md: "calc(83vh)" },
        marginLeft: { sx: 0, md: "14%" },
        marginTop: { sx: "80px", md: 0 },
        px: { sx: 2, md: 4 },
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "95%",
          height: "90%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          position: "absolute",
          top: 0,
        }}
      >
        {chats &&
          chats.map((message, index) =>
            message.fromCAIP10 !== walletToPCAIP10(address) ? (
              <MessageLeft key={index} text={message.messageContent} />
            ) : (
              <MessageRight key={index} text={message.messageContent} />
            )
          )}
        <span ref={dummy}></span>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "8%",
          m: "10px",
          width: "95%",
          zIndex: 10,
          position: "absolute",
          bottom: 0,
        }}
      >
        <SendMessage onSend={handlePushSendMessage} />
      </Box>
    </Box>
  );
}
