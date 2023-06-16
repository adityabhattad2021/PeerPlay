import { useEffect, useState } from "react";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";

export const useSDKSocket = ({ account }) => {
  const env = "staging";
  const socketType = "chat";
  const [epnsSDKSocket, setEpnsSDKSocket] = useState(null);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] =
    useState("");
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState(
    epnsSDKSocket?.connected
  );

  const addSocketEvents = () => {
    console.warn("\n--> addSocketEvents",epnsSDKSocket);
    epnsSDKSocket?.on(EVENTS.CONNECT, () => {
      console.log("CONNECTED: ");
      setIsSDKSocketConnected(true);
    });

    epnsSDKSocket?.on(EVENTS.DISCONNECT, (err) => {
      console.log("DISCONNECTED: ", err);
      setIsSDKSocketConnected(false);
    });
    console.log("\t-->will attach eachMessage event now");
    epnsSDKSocket?.on(EVENTS.USER_FEEDS, (chat) => {

      console.log("\n\n\n\neachMessage event: ", chat);

      // do stuff with data
      setMessagesSinceLastConnection((chat) => {
        return { ...chat, decrypted: false };
      });
    });
  };

  const removeSocketEvents = () => {
    console.warn("\n--> removeSocketEvents");
    epnsSDKSocket?.off(EVENTS.CONNECT);
    epnsSDKSocket?.off(EVENTS.DISCONNECT);
  };

  useEffect(() => {
    if (epnsSDKSocket) {
      addSocketEvents();
    }

    return () => {
      if (epnsSDKSocket) {
        removeSocketEvents();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epnsSDKSocket]);

  useEffect(() => {
    console.log("Inside use Effect",account,env);
    if (account) {
      if (epnsSDKSocket) {
        // console.log('=================>>> disconnection in the hook');
        epnsSDKSocket?.disconnect();
      }
      const main = async () => {
        const connectionObject = createSocketConnection({
          user: account,
          env,
          socketType,
          socketOptions: { autoConnect: false, reconnectionAttempts: 3 },
        });
        console.warn("new connection object: ", connectionObject);

        setEpnsSDKSocket(connectionObject);
      };
      main().catch((err) => console.error(err));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env]);

  return {
    epnsSDKSocket,
    isSDKSocketConnected,
    messagesSinceLastConnection,
  };
};
