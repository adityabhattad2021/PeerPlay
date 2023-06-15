"use client";
import CustomButton from "@/components/CustomButton";
import { Box, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";

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
        }}
      />
      <CustomButton text="Sent" onClick={() => handleSubmit()} />
    </>
  );
}

export default function Chat() {
  const searchParams = useSearchParams();

  const creatorAddress = searchParams.get("creatorAddress");
  const { address } = useAccount();
  const dummy = useRef();
  const [messages, setMessages] = useState([
    { text: "Hello, how are you?", side: "left" },
    { text: "I am fine, thank you!", side: "right" },
  ]);

  async function handlePush(signer) {
    let userObj = await PushAPI.user.get({
      account: `eip155:${address}`,
      env: "staging",
    });

    if (!userObj) {
      userObj = await PushAPI.user.create({
        signer: signer, // ethers.js signer
        env: "staging",
      });
    }

    const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: userObj.encryptedPrivateKey,
      signer: signer,
    });

    const response = await PushAPI.chat.chats({
      account: `eip155:${address}`,
      toDecrypt: true,
      pgpPrivateKey: pgpDecrpyptedPvtKey,
      env: "staging",
    });

    console.log(response);
  }

  async function handlePushSendMessage(message) {
    try{
      console.log("Trying to send message");
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
        let userObj = await PushAPI.user.get({
          account: `eip155:${address}`,
          env: "staging",
        });
        const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: userObj.encryptedPrivateKey,
          signer: signer,
        });
        const response = await PushAPI.chat.send({
          messageContent: message,
          messageType: "Text",
          receiverAddress: `eip155:${creatorAddress}`,
          signer: signer,
          pgpPrivateKey: pgpDecrpyptedPvtKey,
        });
        console.log(response);
      }
    }catch(error){
      console.log(error);
    }
    
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    if (provider) {
      const signer = provider.getSigner();
      console.log("working");
      handlePush(signer);
    }
  }, []);

  
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        height: { sx: "calc(100vh - 80px)", md: "calc(83vh)" },
        marginLeft: { sx: 0, md: "14%" },
        marginTop: { sx: "80px", md: 0 },
        px: { sx: 2, md: 4 },
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "98%",
          height: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          m: "10px",
        }}
      >
        {messages.map((message, index) =>
          message.side === "left" ? (
            <MessageLeft key={index} text={message.text} />
          ) : (
            <MessageRight key={index} text={message.text} />
          )
        )}
        <span ref={dummy}></span>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "10%",
          m: "10px",
          width: "98%",
          zIndex: 10,
        }}
      >
        <SendMessage onSend={handlePushSendMessage} />
      </Box>
    </Box>
  );
}
