import { useContext, useEffect } from "react";
import { SocketContext } from "./context/Socket";
import { webRTC } from "./context/WebRTC";
import { intializeSocket } from "./socket";
import Video from "./components/Video";

function App() {
  const { setSocket, socket } = useContext(SocketContext);
  const { pc, localStream, remoteStream } = useContext(webRTC);

  useEffect(() => {
    setSocket(intializeSocket());
  }, [setSocket]);

  useEffect(() => {
    console.log(socket);
    socket?.emit("join-room", "room");
    socket?.on("offer", async (offer) => {
      if (pc && !pc.currentRemoteDescription) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answerDescription = await pc.createAnswer();
        const answer = {
          type: answerDescription?.type,
          sdp: answerDescription?.sdp,
        };
        pc.onicecandidate = (ev) => {
          ev.candidate &&
            socket.emit("candidate", ev.candidate.toJSON(), "room");
        };
        socket.emit("answer", answer, "room");
        socket.on("answer-accepted", async () => {
          await pc.setLocalDescription(answerDescription);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
        });
      }
    });
    socket?.on("answer", async (answer) => {
      await pc?.setRemoteDescription(new RTCSessionDescription(answer));
      socket.emit("answer-accepted", "room");
    });
    socket?.on("candidate", (candidate) => {
      pc?.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, [socket, pc]);

  const createOffer = async () => {
    if (!pc || !socket) return;
    pc.onicecandidate = (ev) => {
      ev.candidate && socket.emit("candidate", ev.candidate.toJSON(), "room");
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit(
      "offer",
      {
        sdp: offer.sdp,
        type: offer.type,
      },
      "room"
    );
  };

  return (
    <div>
      <button onClick={createOffer}>click</button>
      <div className="videos-container">
        <Video className="video-self" stream={localStream} muted />
        <Video stream={remoteStream} />
      </div>
    </div>
  );
}

export default App;
