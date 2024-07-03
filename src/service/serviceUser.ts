import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "..";
import User from "../types/user";

export const updateUser = (boardId: string, updatedUser: User) => {
  const boardRef = doc(collection(db, "boards"), boardId);
  console.log("TRY UPDATE USER");
  getDoc(boardRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const boardData = docSnapshot.data();

        if (boardData) {
          // Assuming 'users' is an array of objects with 'id' and 'present' fields

          // Find the index of the user to update

          const userIndex = boardData.users.findIndex(
            (user: User) => user.id === updatedUser.id
          );

          if (userIndex !== -1) {
            // Update the user object at the found index
            boardData.users[userIndex] = updatedUser;

            // Update the document in Firestore
            return updateDoc(boardRef, { users: boardData.users })
              .then(() => {
                console.log("Document successfully updated!");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          } else {
            console.error("User not found in the users array.");
          }
        } else {
          console.error("No data found for the board document.");
        }
      } else {
        console.error("Board document does not exist.");
      }
    })
    .catch((error) => {
      console.error("Error fetching document: ", error);
    });
};
