import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditBoard from "./EditBoard";
import SEditBoard from "./SEditBoard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "..";
import { Board } from "../types/board";
import { Zman } from "../types/zmanim";
import Kboard from "./Kboard";
import Sboard from "./SBoard";

function PreviewBoardWrapper(props: Props) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [dbBoard, setDbBoard] = useState<Board>();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data from the database
    const fetchData = async () => {
      if (id) {
        console.log("id", id);
        await getBoardById(id);
      }
    };

    fetchData();
  }, [id, navigate]);
  const getBoardById = async (boardId: string) => {
    try {
      const boardDoc = await getDoc(doc(db, "boards", boardId));
      if (boardDoc.exists()) {
        // Document exists, return its data along with the ID
        const newBoard = { ...boardDoc.data(), id: boardDoc.id };
        if (newBoard) {
          setDbBoard(newBoard as Board);
          setLoading(false);
        }
        console.log("newBoard", newBoard);
      } else {
        // Document does not exist
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {dbBoard && (
        <div>
          {dbBoard?.type === "school" ? (
            <Sboard
              hebrewDate={props.hebrewDate}
              zmanim={props.zmanim}
              parasha={props.parasha}
              omerDays={props.omerDays}
              lastTimeDataUpdated={props.lastTimeDataUpdated}
              roshChodesh={props.roshChodesh}
              holiday={props.holiday}
              getTimesFromDb={props.getTimesFromDb}
            />
          ) : (
            <Kboard
              isMoridHatal={props.isMoridHatal}
              hebrewDate={props.hebrewDate}
              zmanim={props.zmanim}
              parasha={props.parasha}
              omerDays={props.omerDays}
              lastTimeDataUpdated={props.lastTimeDataUpdated}
              roshChodesh={props.roshChodesh}
              holiday={props.holiday}
              getTimesFromDb={props.getTimesFromDb}
            />
          )}
        </div>
      )}
    </div>
  );
}
export default PreviewBoardWrapper;

PreviewBoardWrapper.defaultProps = {
  parasha: "",
  zmanim: undefined,
  isMoridHatal: false,
  omerDays: "",
  hebrewDate: "",
  roshChodesh: "",
  holiday: "",
  lastTimeDataUpdated: 0,
  getTimesFromDb: () => {},
};

interface Props {
  parasha: string;
  omerDays?: string;
  zmanim: Zman[] | undefined;
  board?: Board;
  isMoridHatal: boolean;
  hebrewDate: string;
  roshChodesh: string;
  holiday: string;
  lastTimeDataUpdated: number;
  getTimesFromDb: Function;
}
