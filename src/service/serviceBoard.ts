import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "..";

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
