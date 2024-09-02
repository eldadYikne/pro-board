import { useEffect, useRef, useState } from "react";
import { CloudinaryUploadEvent } from "../types/clodinary";
import { Button } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export function UploadWidget(props: Props) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [imageUrl, setImageUrl] = useState("");
  const secureUri = "http://res.cloudinary.com/dwdpgwxqv/image/upload/";
  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dwdpgwxqv",
        uploadPreset: "kug2bkkf",
      },
      (error: any, result: CloudinaryUploadEvent) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          setImageUrl(`${secureUri}${result.info.path}`);
          props.onSetImageUrl(`${secureUri}${result.info.path}`);
          console.log("result", result);
          console.log("error", error);
        }
      }
    );
  }, []);

  return (
    <div className="w-full">
      {props.previewType === "button" && (
        <Button
          className="w-full"
          onClick={() => widgetRef.current.open()}
          variant="contained"
        >
          {props.text}
        </Button>
      )}
      {props.previewType === "addPhoto" && (
        <AddPhotoAlternateIcon onClick={() => widgetRef.current.open()} />
      )}
      {/* {imageUrl && <a href={imageUrl}>קישור לתמונה</a>} */}
    </div>
  );
}
UploadWidget.defaultProps = {
  text: "",
  previewType: "button",
  onSetImageUrl: () => {},
};

interface Props {
  text: string;
  onSetImageUrl: Function;
  previewType: "button" | "addPhoto";
}
