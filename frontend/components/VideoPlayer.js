import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream, isMuted,className }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  return (
    <video
      className={className}
      ref={videoRef}
      muted={isMuted}
      autoPlay
    />
  );
}
