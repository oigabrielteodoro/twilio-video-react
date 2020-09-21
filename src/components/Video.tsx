import React, { useRef, useEffect } from 'react';
import TwilioVideo, { RemoteParticipant } from 'twilio-video';

interface IVideoProps {
  token: string;
  name: string;
}

const Video: React.FC<IVideoProps> = ({ token, name }) => {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    TwilioVideo.connect(token, {
      audio: true,
      video: true,
      name,
    }).then(room => {
      TwilioVideo.createLocalVideoTrack().then(track => {
        localVideoRef.current?.appendChild(track.attach());
      });

      const addParticipant = (participant: RemoteParticipant) => {
        console.log('new participant');
        console.log(participant);

        participant.tracks.forEach(publication => {
          if (publication.isSubscribed) {
            // const { track } = publication;
  
            // remoteVideoRef.current?.appendChild(track?.attach());
            console.log("attached to remote video")
          } 
        })

        participant.on('trackSubscribed', track => {
          console.log('track subscribed');
          remoteVideoRef.current?.appendChild(track.attach());
        });
      }

      room.participants.forEach(addParticipant);
      room.on('participantConnected', addParticipant);
    })
  }, [token, name]);

  return (
    <div>
      <div ref={localVideoRef} />
      <div ref={remoteVideoRef} />
    </div>
  );
}   

export default Video;