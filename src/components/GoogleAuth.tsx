import { Button } from "@mui/material";
import { auth, googleProvider } from "../index";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";

function GoogleAuth(props: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connectedUser, setConnectedUser] = useState<User>();

  console.log(auth?.currentUser?.email);
  useEffect(() => {}, [connectedUser]);
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };
  const signInWithGoogle = async () => {
    //   const user = await signInWithPopup(auth, googleProvider);
    // signInWithRedirect(auth, googleProvider)
    //   .then((result) => {
    //     setConnectedUser(result.user);
    //     props.setUser(result.user);
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential?.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...

    //     console.log(user);
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //   });

    signInWithRedirect(auth, googleProvider);
    getRedirectResult(auth)
      .then((result: any) => {
        // This gives you the Google OAuth access token and user information.
        // You can use them to access the Google API.
        var user = result.user;
        setConnectedUser(result.user);
        props.setUser(result.user);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
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
      {/* <input placeholder="Email.." onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password.."
        onChange={(e) => setPassword(e.target.value)}
      /> */}
      {/* <button onClick={signIn}> Signin</button> */}
      {!props.userConnected && (
        <Button
          sx={{ display: "flex", alignItems: "center" }}
          variant="contained"
          color="primary"
          onClick={signInWithGoogle}
        >
          הכנס באמצעות גוגל
          <GoogleIcon sx={{ height: 17 }} />
        </Button>
      )}
      {props.userConnected && (
        <Button
          className=" "
          variant="outlined"
          color="primary"
          onClick={logOut}
        >
          התנתק
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
