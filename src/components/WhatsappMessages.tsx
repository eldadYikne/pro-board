import { Message } from "../types/board";
import { MoreVert, Search } from "@mui/icons-material";
import { getCurrentDate } from "../utils/const";

function WhatsappMessages(props: Props) {
  return (
    <div
      style={{
        background: `url(${require(`../assets/whatsapp-bg.jpg`)}) `,
      }}
      className={`w-full text-3xl font-['Nachlieli'] h-full border  `}
    >
      <div className="w-full h-[15%] bg-gray-200">
        <div className="flex gap-4 px-5 justify-between items-center h-full">
          <div className="flex gap-4 items-center h-full">
            <MoreVert />
            <Search />
          </div>
          <div className="flex gap-4 w-1/2 items-center h-full">
            <div className="flex items-end flex-col w-[80%] gap-1">
              <span>{props.boardName}</span>
              <span className="text-gray-500 truncate w-full">
                אביתר, אליה, אלעד, אסף, אפיק, חן, טל, טל, מאור, משה, נועה, נועה,
                עדי, עומרי, קרקס, רעותי, +972 50-997-5931, +972 53-421-2889,
                +972 54-219-0203
              </span>
            </div>
            <img
              className="rounded-full h-full "
              src={props.boardSymbol}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-4 ">
        <div className="flex justify-center items-center  text-gray-500">
          <span className="bg-gray-100 shadow-md p-3 rounded-md ">
            {getCurrentDate()}
          </span>
        </div>
        {props.messages.map((message, index) => {
          return (
            <div
              className={`w-full flex ${
                index % 2 === 0 ? "mr-3 " : " justify-end pl-3"
              }`}
            >
              <div
                className={`my-4 min-w-48 text-5xl p-3 flex shadow-sm rounded-md ${
                  index % 2 === 0 ? "bg-[#dcf8c6]   " : "bg-white "
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WhatsappMessages;

WhatsappMessages.defaultProps = {};

interface Props {
  boardSymbol: string;
  boardName: string;
  messages: Message[];
}
