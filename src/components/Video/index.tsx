import { useEffect, useRef } from "react";

interface IVideoProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}

const Video: React.FC<IVideoProps> = ({ stream, muted, className }) => {
  const video = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video.current) video.current.srcObject = stream;
    console.log(stream);
  }, [stream]);

  return (
    <div
      className={className}
    >
      <video
        ref={video}
        autoPlay
        muted={muted}
      ></video>
    </div>
  );
};

export default Video;
