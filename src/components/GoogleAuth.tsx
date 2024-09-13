import { Button } from "@mui/material";
import { googleProvider } from "../index";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { ReactComponent as GoogleSvg } from "../assets/google.svg";
import LogoutIcon from "@mui/icons-material/Logout";

function GoogleAuth(props: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [connectedUser, setConnectedUser] = useState<User>();
  const auth = getAuth();

  console.log(auth?.currentUser?.email);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("connected user", user);
        setConnectedUser(user);
        props.setUser(user);
      } else {
        console.log("USER FIRBASE NOT FOUND");
      }
    });
    return unsubscribe;
  }, [connectedUser]);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setConnectedUser(undefined);
      props.setUser(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-3">
      {!props.userConnected && (
        <Button
          sx={{ display: "flex", alignItems: "center" }}
          variant="contained"
          color="primary"
          onClick={signInWithGoogle}
        >
          הכנס באמצעות גוגל
          <span className="h-4 w-4 px-1">
            <GoogleSvg />
          </span>
        </Button>
      )}

      {props.userConnected && (
        <Button
          className=" flex gap-1"
          variant="outlined"
          color="primary"
          onClick={logOut}
          endIcon={<LogoutIcon />}
        >
          {props.userConnected}
        </Button>
      )}
    </div>
  );
}

export default GoogleAuth;
GoogleAuth.defaultProps = {
  userConnected: "",
  setUser: () => {},
};

interface Props {
  userConnected: string;
  setUser: Function;
}
