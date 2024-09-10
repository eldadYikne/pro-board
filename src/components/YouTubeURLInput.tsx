import React, { useEffect, useState } from "react";
import YouTubeAudioPlayer from "./YouTubeAudioPlayer"; // Make sure to import your audio player component
import { TextField } from "@mui/material";

const YouTubeURLInput = (props: Props) => {
  const [url, setUrl] = useState(props.value);
  const [videoId, setVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  useEffect(() => {
    async function fechUrlData() {
      //   await fetchVideoTitle(props.value);
    }
    if (props.value) {
      setVideoId(props.value);
      setUrl(`https://www.youtube.com/watch?v=${props.value}`);
      setVideoTitle(props.title);
      //   fechUrlData();
    }
  }, [videoId]);
  const extractVideoId = async () => {
    // Regular expression to extract the video ID
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    try {
      if (match && match[1]) {
        const id = url.includes("youtube") ? match[1] : url;
        const newTitle = await fetchVideoTitle(id); // Fetch video title after extracting the ID
        setVideoId(id);
        console.log("videoTitle", videoTitle);
        props.setYoutubeLink({ id, title: newTitle });
      } else {
        alert("כתובת Youtube לא חוקית");
      }
    } catch (err) {}
  };

  const fetchVideoTitle = async (id: string) => {
    console.log(
      "REACT_APP_STOREAGE_BUCKET",
      process.env.REACT_APP_STOREAGE_BUCKET
    );
    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Replace with your YouTube Data API key
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${API_KEY}&part=snippet`;

    try {
      const response = await fetch(endpoint);

      // setVideoTitle(title);
      const data = await response.json();
      console.log("data", data);
      const title = data.items[0]?.snippet?.title || "Title not found";
      setVideoTitle(title);
      return title;
      //   const title = response.data.items[0]?.snippet?.title || "Title not found";
    } catch (error) {
      console.error("Error fetching video title:", error);
      setVideoTitle("קישור לא תקין");
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full ">
      <p className="sm:text-xl font-['Nachlieli']">
        {" "}
        {videoTitle ?? props.title}
      </p>{" "}
      {/* Display the video title */}
      <div className="flex sm:flex-row flex-col gap-3 ">
        <div className="flex gap-3 flex-col">
          <TextField
            dir="rtl"
            id="filled-basic"
            label={"-הכנס קישור מ Youtube"}
            value={url}
            name={"yuotubeUrl"}
            onChange={handleInputChange}
            variant="filled"
          />
          <button
            onClick={extractVideoId}
            className="bg-blue-500 text-white p-2 rounded"
          >
            אישור
          </button>
        </div>
        {videoId && (
          <div className="flex flex-col gap-2">
            <YouTubeAudioPlayer
              isAutoPlayer={false}
              isVideoPreview={true}
              videoId={videoId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeURLInput;
YouTubeURLInput.defaultProps = {
  setYoutubeLink: () => {},
  value: "",
  title: "",
};
interface Props {
  title: string;
  setYoutubeLink: Function;
  value: string;
}
