import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditBoard from "./EditBoard";
import SEditBoard from "./SEditBoard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "..";
import { Board } from "../types/board";
import { Zman } from "../types/zmanim";

const EditBoardWrapper = (props: Props) => {
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
            <SEditBoard
              shabatTimes={{
                candles: props.shabatTimes.candles,
                havdalah: props.shabatTimes.havdalah,
              }}
              zmanim={props.zmanim}
              parasha={props.parasha}
            />
          ) : (
            <EditBoard
              shabatTimes={{
                candles: props.shabatTimes.candles,
                havdalah: props.shabatTimes.havdalah,
              }}
              zmanim={props.zmanim}
              parasha={props.parasha}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EditBoardWrapper;
EditBoardWrapper.defaultProps = {
  parasha: "",
  zmanim: undefined,
};

interface Props {
  parasha: string;
  zmanim: Zman[] | undefined;
  shabatTimes: { candles: string; havdalah: string };
}
