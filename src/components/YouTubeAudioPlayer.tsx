import React from "react";

const YouTubeAudioPlayer = (props: Props) => {
  return (
    <div className="audio-container">
      <iframe
        width={props.isVideoPreview ? "300" : "0"}
        height={props.isVideoPreview ? "240" : "0"}
        src={`https://www.youtube.com/embed/${props.videoId}?autoplay=${
          props.isAutoPlayer ? "1" : "0"
        }&loop=1&playlist=${props.videoId}&controls=0&showinfo=0&rel=0`}
        title="YouTube audio player"
        frameBorder="0"
        allow={props.isAutoPlayer ? "autoplay; encrypted-media" : ""}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeAudioPlayer;
YouTubeAudioPlayer.defaultProps = {
  isAutoPlayer: true,
  isVideoPreview: false,
  videoId: "",
};
interface Props {
  isAutoPlayer: boolean;
  isVideoPreview: boolean;
  videoId: string;
}
