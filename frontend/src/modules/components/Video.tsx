import { useEffect, useRef } from "react";

export default function Video({ video }: { video: string }) {
  const videoRef: any = useRef();

  useEffect(() => {
    videoRef.current?.load();
  }, [video]);

  return (
    <>
      <video ref={videoRef} controls width="100%">
        <source src={video} type="video/mp4" />
      </video>
    </>
  );
}
