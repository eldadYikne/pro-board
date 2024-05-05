import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Board } from "../types/board";
import { db } from "..";
import User, { SeatUser } from "../types/user";
import { Button } from "@mui/material";
import { Payment } from "@mui/icons-material";
import Ktable from "./Ktable";

function EditUsers(props: Props) {
  const { id } = useParams();
  const [dbBoard, setDbBoard] = useState<Board>();

  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardByIdSnap(id);
      }
    }
    fetchData();
  });

  const getBoardByIdSnap = async (boardId: string) => {
    try {
      const boardRef = doc(db, "boards", boardId);

      // Listen to changes in the board document
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          // Document exists, return its data along with the ID
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setDbBoard(newBoard as Board);
          }
          console.log(newBoard);
        } else {
          // Document does not exist
          console.log("Board not found");
          // setDbBoard(null); // or however you handle this case in your application
        }
      });

      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  return (
    <div>
      {/* {dbBoard?.users && (
        <Ktable
          columnData={dbBoard?.users.map((user) => ({
            name: user.name,
            seats: user.seats.length,
            action: [
              { actionName: "הוסף חיוב", type: "payment", action: () => {} },
            ],
          }))}
          rowsData={["שם", "מס מקומות", "פעולות"]}
        />
      )} */}
      {dbBoard?.users &&
        dbBoard.users.map((user: User) => {
          return (
            <div className="flex m-2 p-3 shadow-sm border-teal-500 rounded-md border">
              <div className="flex w-full gap-1 justify-between">
                <span>
                  {user.name} - {user.seats.length}
                </span>
                <Button variant="contained" startIcon={<Payment />}>
                  <span className="mx-2">הוסף חוב</span>
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
export default EditUsers;

EditUsers.defaultProps = {};

interface Props {}
