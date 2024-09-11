import { Box } from "@mui/material";
import { User } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";
import LoginImage from "../assets/login.jpg";

function FreezePage(props: Props) {
  return (
    <div className="min-h-screen  flex items-center justify-center font-['Nachlieli'] bg-gradient-to-r from-yellow-500 via-red-400 to-orange-500">
      <div className="bg-white mx-3  p-8 rounded-lg shadow-lg max-w-md w-full">
        <img src={LoginImage} />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          שלום {props.connectedUser?.displayName ?? props?.baordName}
        </h2>
        <h2 className="text-4xl gap-2 flex flex-col font-bold text-center text-gray-800 mb-6">
          <span>לוח זה הוקפא</span>
        </h2>

        <div className="flex flex-col items-center"></div>
      </div>
    </div>
  );
}
export default FreezePage;

FreezePage.defaultProps = {};
interface Props {
  connectedUser?: User;
  baordName?: string;
}
