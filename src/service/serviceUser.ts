import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "..";
import KUser from "../types/user";

export const updateUser = (boardId: string, updatedUser: KUser) => {
  const boardRef = doc(collection(db, "boards"), boardId);
  console.log("TRY UPDATE USER", updatedUser);
  getDoc(boardRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const boardData = docSnapshot.data();
        if (boardData) {
          // Assuming 'users' is an array of objects with 'id' and 'present' fields

          // Find the index of the user to update

          const userIndex = boardData.users.findIndex(
            (user: KUser) => user.id === updatedUser.id
          );

          if (userIndex !== -1) {
            // Update the user object at the found index
            boardData.users[userIndex] = updatedUser;

            // Update the document in Firestore
            return updateDoc(boardRef, { users: boardData.users })
              .then(() => {
                console.log("User updated successfully from serviceUser!");
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
export const updateManyUsers = (boardId: string, updatedUsers: KUser[]) => {
  const boardRef = doc(collection(db, "boards"), boardId);

  return getDoc(boardRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const boardData = docSnapshot.data();

        if (boardData) {
          // Assuming 'users' is an array of objects with 'id' and 'present' fields
          const updatedUsersMap = new Map(
            updatedUsers.map((user) => [user.id, user])
          );

          // Update each user in the users array
          const updatedUsersArray = boardData.users.map((user: KUser) => {
            const updatedUser = updatedUsersMap.get(user.id);
            return updatedUser ? { ...user, ...updatedUser } : user;
          });

          // Update the document in Firestore with the modified users array
          return updateDoc(boardRef, { users: updatedUsersArray })
            .then(() => {
              console.log("Users updated successfully from serviceUser!");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
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
export const addNewUser = (boardId: string, newUser: KUser) => {
  const boardRef = doc(collection(db, "boards"), boardId);
  // Get the current document snapshot
  getDoc(boardRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const boardData = docSnapshot.data();
        if (boardData) {
          // Assuming 'users' is an array of objects with 'id' and 'present' fields

          // Check if the user already exists
          const userExists = boardData.users.some(
            (user: KUser) => user.id === newUser.id
          );

          if (!userExists) {
            // Add the new user to the array
            const updatedUsers = [...boardData.users, newUser];

            // Update the document in Firestore with the new users array
            return updateDoc(boardRef, { users: updatedUsers })
              .then(() => {
                console.log("User added successfully!");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          } else {
            console.error("User already exists in the users array.");
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
