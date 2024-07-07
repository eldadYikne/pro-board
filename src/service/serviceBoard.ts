import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "..";
import { Board } from "../types/board";

export const postCollectionCoustumId = async (
  collectionName: string,
  collectionValues: any,
  idNameCollection: string
) => {
  const batch = writeBatch(db);
  const boardRef = doc(collection(db, collectionName), idNameCollection); // Using 'calaniot' as the board ID

  // Set the data for the board document
  batch.set(boardRef, collectionValues);

  // Commit the batch write
  await batch.commit();
};

export const updateBoard = async (boardId: string, boardData: any) => {
  const boardRef = doc(collection(db, "boards"), boardId); // Get reference to the user document
  try {
    await updateDoc(boardRef, boardData); // Update the user document with new data
    console.log("BOARD updated successfully from serviceBoard!");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const updateBoardExceptUsers = async (
  boardId: string,
  updatedBoardData: Board
) => {
  const boardRef = doc(db, "boards", boardId); // Reference to the board document

  try {
    // Fetch the current board document
    const boardDoc = await getDoc(boardRef);

    if (boardDoc.exists()) {
      // Get the existing board data
      const boardData = boardDoc.data();

      // Preserve the "users" array from the existing data
      const { users } = boardData;

      // Update the board document with the updated data, including preserving "users"
      await updateDoc(boardRef, { ...updatedBoardData, users });

      console.log("Board updated successfully!");
    } else {
      console.error("Board not found!");
    }
  } catch (error) {
    console.error("Error updating board:", error);
  }
};
