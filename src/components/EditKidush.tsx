import { Close, Menu } from "@mui/icons-material";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Board, MenuLink } from "../types/board";
import { db } from "..";
import GoogleAuth from "./GoogleAuth";
import { CircularProgress } from "@mui/material";
import AdminNavbar from "./AdminNavbar";
import { KidushFood, kidushFoods } from "../utils/const";
function EditKidush(props: Props) {
  const { id } = useParams();

  const [connectedUser, setConnectedUser] = useState<User>();
  const [dbBoard, setDbBoard] = useState<Board>();
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardByIdSnap(id);
      }
    }
    fetchData();
  }, [id]);
  const getBoardByIdSnap = async (boardId: string) => {
    try {
      const boardRef = doc(db, "boards", boardId);

      // Listen to changes in the board document
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          // Document exists, push its data into the array along with the ID
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard.id) {
            setDbBoard(newBoard as Board);
          }

          console.log(newBoard);
        } else {
          // Document does not exist
          console.log("Board not found");
        }
      });

      // Return the array and the unsubscribe function
      return { unsubscribe };
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-start">
      <AdminNavbar />
      <div className="w-full flex flex-col ">
        <div className="text-xl font-medium font-sans px-3 bg-slate-300">{`קידוש - ${props.parasha}`}</div>
        {kidushFoods.map((kidushFood: KidushFood) => {
          return (
            <div>
              <span className="bg-slate-200 w-full flex text-lg px-3">
                {kidushFood.category}
              </span>
              {kidushFood.items.map((item) => {
                return <div className="flex w-full px-4">{item.name}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EditKidush;

EditKidush.defaultProps = {
  parasha: "",
};

interface Props {
  parasha: string;
}
