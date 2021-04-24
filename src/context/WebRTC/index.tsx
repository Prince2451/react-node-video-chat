import React, { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../Socket";

export const webRTC = createContext<{
  pc: RTCPeerConnection | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}>({
  pc: null,
  localStream: null,
  remoteStream: null,
});

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const WebRTCProvider: React.FC = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  function createPeerConnection() {
    try {
      let newPc = new RTCPeerConnection(servers);
      setPc(newPc);
    } catch (err) {
      console.log("could not create peer connection", err);
    }
  }
  async function gotStream(stream: MediaStream) {
    setLocalStream(stream);
  }

  useEffect(() => {
    async function sendOffer() {
      if (socket && localStream && pc) {
        localStream.getTracks().forEach((track) => {
          pc?.addTrack(track, localStream);
        });
        let remoteStream = new MediaStream();
        pc.ontrack = (ev) => {
          ev.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };
        setRemoteStream(remoteStream);
      }
    }
    sendOffer();
  }, [socket, localStream, pc]);

  useEffect(() => {
    createPeerConnection();
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(gotStream)
      .catch(function (e) {
        alert("getUserMedia() error: " + e.name);
      });
  }, []);

  return (
    <webRTC.Provider
      value={{
        pc,
        localStream,
        remoteStream,
      }}
    >
      {children}
    </webRTC.Provider>
  );
};

export default WebRTCProvider;
