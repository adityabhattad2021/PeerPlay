"use client";
import { Stack } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/Upload";
import StreamIcon from "@mui/icons-material/Stream";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter,usePathname } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";

const pages = [
  { name: "New", icon: <HomeIcon /> ,path:"/"},
  { name: "Upload", icon: <UploadIcon /> ,path:'/video/upload'},
  { name: "Minted Videos", icon: <StreamIcon />,path:'/video/purchased' },
  { name: "Push Chat", icon: <ChatBubbleIcon />,path:'/chat' },
];

export default function Sidebar({ selectedPage, setSelectedPage }) {
  const notSmallScreen = useMediaQuery("(min-width:870px)");
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Stack
      direction="row"
      sx={{
        overflowY: "auto",
        height: { sx: "auto", md: "90%" },
        flexDirection: { md: "column" },
      }}
    >
      {pages.map((page) => (
        <button
          className="category-btn"
          style={{
            background: page.path === pathname && "#289935",
            color: "white",
          }}
          onClick={() => {
            setSelectedPage(page.name);
            router.push(page.path);
          }}
          key={page.name}
        >
          <span
            style={{
              color: page.path === pathname ? "white" : "#289935",
              marginRight: "15px",
            }}
          >
            {page.icon}
          </span>
          <span
            style={{
              opacity: page.path === pathname ? "1" : "0.8",
            }}
          >
            {page.name}
          </span>
        </button>
      ))}
      {(!notSmallScreen && isConnected) && (
        <button
          className="category-btn"
          style={{
            background: "#289935",
            height: "40px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => disconnect()}
        >
          <span
            style={{
              white: "#289935",
            }}
            onClick={() => disconnect()}
          >
            Disconnect
          </span>
        </button>
      )}
    </Stack>
  );
}