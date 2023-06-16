import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream, isMuted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  return (
    <video
      style={{
        width: "25vw",
        height: "fit-content",
        border: "2px solid black",
      }}
      ref={videoRef}
      muted={isMuted}
      autoPlay
    />
  );
}
