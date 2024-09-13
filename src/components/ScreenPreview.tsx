import { Button } from "@mui/material";
import { Board, ScreenType, ScreenTypeTypes } from "../types/board";
import { Delete, EmojiObjectsOutlined } from "@mui/icons-material";
import { UploadWidget } from "./UploadWidget";

function ScreenPreview(props: Props) {
  const {
    handleAddScreen,
    onDeleteScreen,
    setEditingScreen,
    setEditScreenWithImagesArray,
    dbBoard,
    isEditScreen,
    screen,
    screenType,
  } = props;
  return (
    <div className="w-full font-['Comix']  sm:min-h-[320px] flex flex-col items-center justify-center gap-3">
      <div
        style={{
          background: `url(${require(`../assets/school-backgrounds/${
            screenType === "birthday"
              ? `${screen.background}`
              : dbBoard.boardBackgroundImage
          }.jpg`)}) no-repeat`,
          backgroundSize: "cover !importent",
        }}
        className={`sm:w-full sm:min-h-[260px] min-h-[160px] !bg-cover flex justify-center items-center p-3  ${
          isEditScreen ? "w-[340px]" : "w-[200px] h-[200px]"
        }`}
      >
        {screenType === "image" && screen && (
          <div
            dir="rtl"
            className="flex flex-col w-full items-center justify-center text-center text-2xl font-['David']"
          >
            <input
              dir="rtl"
              className={`${
                isEditScreen ? "border border-black" : ""
              } w-full h-8 px-3 mb-3 rounded-sm`}
              placeholder="הוסף כותרת"
              type="text"
              value={screen.title}
              disabled={!isEditScreen}
              onChange={(e) =>
                setEditingScreen({
                  ...props.screen,
                  title: e.target.value,
                })
              }
            />

            {screen.imgUrl && !Array.isArray(screen.imgUrl) ? (
              <div className="h-full sm:w-1/2 w-full flex flex-col relative">
                <img className="" alt="" src={screen.imgUrl} />
                <span
                  className="absolute top-1 left-1 cursor-pointer border border-white rounded-full "
                  onClick={() => {
                    setEditingScreen({
                      ...props.screen,
                      imgUrl: "",
                    });
                  }}
                >
                  <Delete style={{ color: "white" }} />
                </span>
              </div>
            ) : (
              <div className="p-4 border bg-transparent text-center border-black">
                {isEditScreen && (
                  <UploadWidget
                    text={screen.imgUrl ? "החלף תמונה" : "הוסף תמונה"}
                    previewType="addPhoto"
                    onSetImageUrl={(e: string) =>
                      setEditingScreen((prevState: ScreenType) => {
                        if (prevState) {
                          return {
                            ...prevState,
                            imgUrl: e,
                          };
                        }
                      })
                    }
                  />
                )}
              </div>
            )}
          </div>
        )}
        {screenType === "images" && screen && (
          <div
            dir="rtl"
            className="flex flex-col w-full items-center justify-center text-center text-2xl"
          >
            <input
              dir="rtl"
              className={`${
                isEditScreen ? "border border-black" : ""
              } w-full bg-transparent text-center h-8 px-3 mb-3 rounded-sm`}
              placeholder="הוסף כותרת"
              type="text"
              disabled={!isEditScreen}
              value={screen.title}
              onChange={(e) =>
                setEditingScreen({
                  ...props.screen,
                  title: e.target.value,
                })
              }
            />
            <div className={`grid gap-2 grid-cols-3`}>
              {Array.isArray(screen.imgUrl) &&
                screen.imgUrl.map((img: string, index: number) => {
                  return (
                    <div className="h-full w-full flex flex-col relative">
                      <img
                        className="w-16 h-16 sm:w-20 sm:h-20"
                        alt=""
                        src={img}
                      />
                      {isEditScreen && (
                        <span
                          className="absolute top-1 left-1 cursor-pointer border border-white rounded-full "
                          onClick={() => {
                            let images: string[] = props.screen
                              ?.imgUrl as string[];
                            images?.splice(index, 1);
                            setEditingScreen({
                              ...props.screen,
                              imgUrl: images,
                            });
                          }}
                        >
                          <Delete
                            style={{
                              color: "white",
                            }}
                          />
                        </span>
                      )}
                    </div>
                  );
                })}
              {isEditScreen && (
                <div className="p-4 cursor-pointer border bg-transparent text-center border-black">
                  {Array.isArray(screen.imgUrl) && screen.imgUrl && (
                    <UploadWidget
                      text="הוסף תמונה"
                      previewType="addPhoto"
                      onSetImageUrl={(e: string) =>
                        setEditScreenWithImagesArray(e)
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {screenType === "info" && screen && (
          <div className="flex h-full w-full items-center justify-center flex-col gap-2 ">
            <div className="flex gap-1 p-2 bg-yellow-300 rounded-3xl items-center">
              <span className=" font-['Comix']">הידעת</span>
              <EmojiObjectsOutlined sx={{ fontSize: "" }} />
            </div>
            <div
              dir="rtl"
              className={`flex w-3/4  h-full items-center gap-7 justify-center text-center  font-['Comix'] ${
                isEditScreen ? "" : "h-[75%]"
              }`}
            >
              <div className="flex flex-col max-w-[50%] gap-2">
                <input
                  dir="rtl"
                  disabled={!isEditScreen}
                  className={`${
                    isEditScreen ? "border border-black" : ""
                  } w-full bg-transparent text-center h-8 px-3 mb-3 rounded-sm`}
                  placeholder="הוסף כותרת"
                  type="text"
                  value={screen.title}
                  onChange={(e) =>
                    setEditingScreen({
                      ...props.screen,
                      title: e.target.value,
                    })
                  }
                />
                <span className="text-sm sm:text-base ">
                  <textarea
                    dir="rtl"
                    className={`${
                      isEditScreen
                        ? "border border-black"
                        : "overflow-hidden resize-none bg-transparent"
                    } w-full h-full text-center sm:min-h-[130px]  px-3 mb-3 rounded-sm`}
                    placeholder="הוסף מידע"
                    disabled={!isEditScreen}
                    value={screen.content}
                    onChange={(e) =>
                      setEditingScreen({
                        ...props.screen,
                        content: e.target.value,
                      })
                    }
                    name="Outlined"
                  />
                </span>
              </div>
              {screen.imgUrl && !Array.isArray(screen.imgUrl) ? (
                <div className="h-full sm:w-1/2 w-full flex flex-col relative">
                  <img className="" alt="" src={screen.imgUrl} />

                  {isEditScreen && (
                    <span
                      className="absolute top-1 left-1 cursor-pointer border border-white rounded-full "
                      onClick={() => {
                        setEditingScreen({
                          ...props.screen,
                          imgUrl: "",
                        });
                      }}
                    >
                      <Delete style={{ color: "white" }} />
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-4 border border-black">
                  {isEditScreen && (
                    <UploadWidget
                      text={screen.imgUrl ? "החלף תמונה" : "הוסף תמונה"}
                      previewType="addPhoto"
                      onSetImageUrl={(e: string) =>
                        setEditingScreen((prevState: ScreenType) => {
                          if (prevState) {
                            return {
                              ...prevState,
                              imgUrl: e,
                            };
                          }
                        })
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {(screenType === "message" || screenType === "birthday") && screen && (
          <div className="w-full">
            <input
              dir="rtl"
              className={`${
                isEditScreen
                  ? "border text-center text-2xl border-black"
                  : "!z-0"
              } w-full bg-transparent h-8 px-3 mb-3 rounded-sm`}
              placeholder="הקלד הודעה"
              disabled={!isEditScreen}
              type="text"
              value={screen.content}
              onChange={(e) =>
                setEditingScreen({
                  id: screen.id,
                  text: screen.text,
                  title: screen.title,
                  type: screen.type,
                  background: props.screen.background ?? "",
                  content: e.target?.value,
                })
              }
            />
          </div>
        )}
      </div>

      {screenType === "birthday" && screen && isEditScreen && (
        <div className="flex gap-2 overflow-x-auto sm:w-full !w-[350px]">
          {["1", "2", "3", "4", "5"].map((item) => {
            return (
              <div
                onClick={() =>
                  setEditingScreen({
                    id: screen.id,
                    text: screen.text,
                    title: screen.title,
                    type: screen.type,
                    background: `birthday${item}`,
                    content: screen.content,
                  })
                }
                key={item}
                style={{
                  background: `url(${require(`../assets/kodesh-backgrounds/birthday${item}.jpg`)}) no-repeat`,
                  backgroundSize: "cover !importent",
                }}
                className="h-16 w-24 !bg-cover flex justify-center items-center p-3  "
              ></div>
            );
          })}
        </div>
      )}
      {screen && isEditScreen && (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              onDeleteScreen(props.screen);
            }}
            variant="contained"
            color="error"
            startIcon={props.screen.id ? <Delete /> : <div></div>}
          >
            {props.screen.id ? "הסר מסך" : "ביטול"}
          </Button>
          <Button onClick={() => handleAddScreen()} variant="contained">
            אישור
          </Button>
        </div>
      )}
    </div>
  );
}
export default ScreenPreview;

ScreenPreview.defultProps = {
  isEditScreen: false,
};
interface Props {
  screen: ScreenType;
  screenType: ScreenTypeTypes;
  onDeleteScreen: Function;
  handleAddScreen: Function;
  setEditingScreen: Function;
  setEditScreenWithImagesArray: Function;
  dbBoard: Board;
  isEditScreen: boolean;
}
