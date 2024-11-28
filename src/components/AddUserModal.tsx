import { Box, Button, Modal, TextField } from "@mui/material";
import KUser from "../types/user";

export default function AddUserModal({
  editModalIsOpen,
  setEditModalIsOpen,
  userToEdit,
  setUserToEdit,
  addUser,
  newUser,
}: Props) {
  return (
    <div>
      <Modal
        sx={{ overflowY: "scroll", overflowX: "hidden" }}
        className="mx-2 px-3"
        open={editModalIsOpen}
        onClose={() => {
          setEditModalIsOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDownloadImgBox}>
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <span className="text-2xl">הוסף מתפלל</span>
            {userToEdit &&
              Object.keys(newUser).map((key: string) => {
                return (
                  <div>
                    {!Array.isArray(userToEdit[key as keyof KUser]) &&
                      key !== "id" &&
                      key !== "present" && (
                        <TextField
                          sx={{ width: "100%%" }}
                          dir="rtl"
                          id="filled-basic"
                          label={key == "name" ? "שם מלא" : key}
                          name={""}
                          value={userToEdit[key as keyof KUser]}
                          type="text"
                          onChange={(e) =>
                            setUserToEdit({
                              ...userToEdit,
                              [key]: e.target.value, // Update the correct property in userToEdit
                            })
                          }
                          variant="filled"
                        />
                      )}
                  </div>
                );
              })}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                addUser();
              }}
              disabled={!!!userToEdit?.name}
              variant="contained"
            >
              אישור
            </Button>

            <Button
              onClick={() => {
                setEditModalIsOpen(false);
              }}
              variant="contained"
            >
              ביטול
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

AddUserModal.defaultProps = {
  setEditModalIsOpen: () => {},
  setUserToEdit: () => {},
  addUser: () => {},
  editModalIsOpen: false,
};

interface Props {
  setEditModalIsOpen: Function;
  setUserToEdit: Function;
  addUser: Function;
  editModalIsOpen: boolean;
  userToEdit: KUser;
  newUser: KUser;
}
const styleDownloadImgBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "",
  boxShadow: 24,
  overflowY: "scroll",
  p: 6,
};
