import GoogleAuth from "./GoogleAuth";
import LoginImage from "../assets/login.jpg";
function Login(props: Props) {
  return (
    <div className="min-h-screen  flex items-center justify-center font-['Nachlieli'] bg-gradient-to-r from-blue-500 via-blue-200 to-teal-500">
      <div className="bg-white mx-3  p-8 rounded-lg shadow-lg max-w-md w-full">
        <img src={LoginImage} />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ברוכים הבאים
        </h2>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          {props.boardName}{" "}
        </h2>
        <p className="text-center text-xl text-gray-600 mb-6">
          בכדי להתחיל לערוך את הלוח עליך להתחבר
        </p>
        <div className="flex flex-col items-center">
          <GoogleAuth
            setUser={props.setConnectedUser}
            userConnected={props.userConnected}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

Login.defaultProps = {
  setConnectedUser: () => {},
  boardName: "",
  userConnected: "",
};

interface Props {
  setConnectedUser: Function;
  boardName: string;
  userConnected: string;
}
