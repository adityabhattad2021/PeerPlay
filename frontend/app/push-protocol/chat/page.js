"use client";
import CustomButton from "@/components/CustomButton";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { useState, useRef } from "react";

function MessageLeft({ text }) {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start",my:"10px" }}>
      <Box
        sx={{
          backgroundColor: "#289935",
          px:"15px",
          borderRadius: "20px",
          color:"white",
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
        my:"10px"
      }}
    >
      <Box
        sx={{
          backgroundColor: "#289935",
          px:"15px",
          color:"white",
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
          height:"95%",
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
  const dummy = useRef();
  const [messages, setMessages] = useState([
    { text: "Hello, how are you?", side: "left" },
    { text: "I am fine, thank you!", side: "right" },
  ]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, side: "right" }]);
    dummy.current.scrollIntoView({ behavior: "smooth",mt:"-10px" });
  };
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
        // backgroundColor: "white",
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
        <SendMessage onSend={handleSendMessage} />
      </Box>
    </Box>
  );
}
