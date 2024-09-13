import { Box } from "@mui/material";
import { User } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";
import LoginImage from "../assets/login.jpg";

function NotAllowedEdit(props: Props) {
  return (
    <div className="min-h-screen  flex items-center justify-center font-['Nachlieli'] bg-gradient-to-r from-blue-500 via-blue-200 to-teal-500">
      <div className="bg-white mx-3  p-8 rounded-lg shadow-lg max-w-md w-full">
        <img src={LoginImage} />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          שלום {props.connectedUser.displayName}
        </h2>
        <h2 className="text-4xl gap-2 flex flex-col font-bold text-center text-gray-800 mb-6">
          <span>למשתמש</span>
          <span className="text-3xl"> {props.connectedUser.email}</span>
          <span> אין הרשאה לערוך לוח זה </span>
        </h2>

        <div className="flex flex-col items-center">
          <GoogleAuth
            setUser={props.setConnectedUser}
            userConnected={props.connectedUser.displayName ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
export default NotAllowedEdit;

NotAllowedEdit.defaultProps = {
  setConnectedUser: () => {},
};
interface Props {
  connectedUser: User;
  setConnectedUser: Function;
}
const styleBoxNotAllowEdit = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "",
  boxShadow: 24,
  p: 6,
};
