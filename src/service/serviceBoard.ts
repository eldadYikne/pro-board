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
  const boardRef = doc(collection(db, collectionName), idNameCollection);

  // Set the data for the board document
  batch.set(boardRef, collectionValues);

  // Commit the batch write
  await batch.commit();
};
export const updateCollectionById = async (
  cellectionName: string,
  userData: any,
  userId: string
) => {
  const userRef = doc(collection(db, cellectionName), userId); // Get reference to the user document

  try {
    await updateDoc(userRef, userData); // Update the user document with new data
    console.log("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
  }
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
    const boardDoc = await getDoc(boardRef);

    if (boardDoc.exists()) {
      const boardData = boardDoc.data();

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

export const updateActiveScreens = async (
  boardId: string,
  activeScreens: number
) => {
  const boardRef = doc(db, "boards", boardId); // Reference to the board document

  try {
    // Update only the activeScreens key
    await updateDoc(boardRef, { activeScreens });

    console.log("activeScreens updated successfully!");
  } catch (error) {
    console.error("Error updating activeScreens:", error);
  }
};
