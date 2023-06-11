import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEnsName } from "wagmi";
import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VideoCard({ video }) {
  const [videoName, setVideoName] = useState();

  useEffect(() => {
    getImageName(video.thumbnailHash).then((name) => {
      setVideoName(name);
    });
  }, []);

  async function getImageName(thumbnailHash) {
    const url = "https://dweb.link/api/v0";
    const ipfs = create({ url });
    const name = [];
    for await (const link of ipfs.ls(thumbnailHash)) {
      name.push(link);
    }
    return name[0].name;
  }

  const ensName = useEnsName({
    address: video?.creator,
    chainId: 1,
  });

  return (
    <Card
      sx={{
        width: { xs: "300px", sm: "305px", md: "305px" },
        height: "250px",
        boxShadow: "none",
        borderRadius: 3,
      }}
    >
      <Link href={`/video/watch/${video.videoId.toString()}`}>
        <CardMedia
          image={`${process.env.NEXT_PUBLIC_IPFS_START_URL}/${video.thumbnailHash}/${videoName}`}
          alt={"dmeo tilt"}
          sx={{ width: { xs: "100%", sm: "358px" }, height: 180 }}
        />
      </Link>
      <CardContent sx={{ backgroundColor: "#1E1E1E", height: "106px" }}>
        <Link href={`/video/watch/${video.videoId.toString()}`}>
          <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
            {video.title}
          </Typography>
        </Link>
        <Typography variant="subtitle2" color="gray">
          {ensName.data
            ? ensName.data
            : (video?.creator).slice(0, 4) +
              "..." +
              (video?.creator).slice(-5, -1)}
          <CheckCircleIcon
            sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
          />
        </Typography>
      </CardContent>
    </Card>
  );
}
