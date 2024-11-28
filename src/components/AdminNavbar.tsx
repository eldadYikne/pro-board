import { Close, Menu } from "@mui/icons-material";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Board, MenuLink } from "../types/board";
import { db } from "..";
import GoogleAuth from "./GoogleAuth";
import { Button, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
function AdminNavbar(props: Props) {
  const { id } = useParams();
  const auth = getAuth();
  const [connectedUser, setConnectedUser] = useState<User>();
  const [dbBoard, setDbBoard] = useState<Board>();
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  // TASK 1: CRATE GAURD TO ADMIN PAGE

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("connected user", user);
        setConnectedUser(user);
        // ...
      } else {
        console.log("USER FIRBASE NOT FOUND");
        // User is signed out
        // ...
      }
    });
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardById(id);
      }
    }
    fetchData();
    return unsubscribe;
  }, [id, connectedUser?.email]);
  const getBoardById = async (boardId: string) => {
    try {
      const boardDoc = await getDoc(doc(db, "boards", boardId));
      if (boardDoc.exists()) {
        const newBoard = { ...boardDoc.data(), id: boardDoc.id };
        if (newBoard) {
          setDbBoard(newBoard as Board);
        }
        console.log("newBoard", newBoard);
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  const menuLinks: MenuLink[] = [
    { link: `/edit/${id}`, text: "ערוך לוח", icon: "pencel" },
    { link: `/edit/${id}/users`, text: "מתפללים", icon: "users" },
    { link: `/map/${id}`, text: "מפת בית הכנסת", icon: "map" },
    { link: `/board/${id}`, text: "לוח", icon: "tv" },
    // { link: `/kidush/${id}`, text: "קידוש", icon: "cup" },
  ];

  return (
    <div className="flex flex-col w-full font-['Nachlieli'] justify-center items-center">
      <div className="flex justify-between w-full p-2 items-center bg-slate-400">
        {!props.isSchoolBoard && (
          <Menu onClick={() => setMenuIsOpen(true)} sx={{}} />
        )}
        <div className=" text-xl ">{dbBoard && dbBoard.boardName}</div>
        <div className="flex gap-5 items-center">
          {props.isUsersPage && (
            <div className="flex gap-3 items-center">
              <Button
                size="small"
                onClick={() => props.setAddUserModal()}
                variant="contained"
              >
                מתפלל חדש +{" "}
              </Button>
            </div>
          )}
          <div className="flex gap-2 items-center ">
            {/* {connectedUser && <div> {connectedUser.displayName}</div>} */}
            <GoogleAuth
              setUser={(e: User) => {
                props.setConnectedUser(e);
                setConnectedUser(e);
              }}
              userConnected={connectedUser?.displayName ?? ""}
            />
          </div>
        </div>
      </div>
      {!dbBoard && (
        <div className="flex ">
          <CircularProgress />
        </div>
      )}
      <div className="sidebar" style={{ width: menuIsOpen ? "250px" : "0px" }}>
        {menuIsOpen && (
          <div className="flex flex-col p-5 gap-3 text-xl font-sans text-white">
            <span className="closebtn">
              <Close
                className="cursor-pointer"
                onClick={() => setMenuIsOpen(false)}
              />
            </span>
            {menuLinks.map((link) => {
              return (
                <span
                  className="!hover:shadow-xl active:bg-[#485e82] flex justify-between w-full z-20 rounded-xl p-3 cursor-pointer sidebar-link"
                  onClick={() => navigate(link.link)}
                >
                  <span>{link.text}</span>
                  <span>
                    <img
                      className="w-5 h-5"
                      src={require(`../assets/${link.icon}.svg`)}
                    />
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNavbar;

AdminNavbar.defaultProps = {
  isUsersPage: false,
  isSchoolBoard: false,
  setAddUserModal: () => {},
  setConnectedUser: () => {},
};

interface Props {
  setAddUserModal: Function;
  isUsersPage: boolean;
  isSchoolBoard: boolean;
  setConnectedUser: Function;
}
