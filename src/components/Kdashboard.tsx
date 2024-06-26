import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";

function Kdashboard(props: Props) {
  const [connectedUser, setConnectedUser] = useState<User>();
  const auth = getAuth();
  useEffect(() => {}, []);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("connected user", user);
      setConnectedUser(user);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  return (
    <div>
      dashboard
      {connectedUser && <div>{connectedUser.displayName}</div>}
      <GoogleAuth
        setUser={setConnectedUser}
        userConnected={connectedUser?.email ?? ""}
      />
    </div>
  );
}

export default Kdashboard;
Kdashboard.defaultProps = {};

interface Props {}
