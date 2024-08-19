import React from "react";
import { writeFile, utils } from "xlsx";
import KUser from "../types/user";
import { Button } from "@mui/material";
import { Description } from "@mui/icons-material";
import { getCurrentDate } from "../utils/const";

const DownloadExcelButton = (props: Props) => {
  const handleDownload = () => {
    // Create an array to store the data
    const data: unknown[] = [];

    // Loop through each user and add their data to the array
    props.users.forEach((user: KUser) => {
      if (user.debts.length > 0) {
        user.debts.forEach((debt) => {
          data.push({
            Name: user.name,
            DebtSum: debt.sum,
            Reason: debt.reason,
            Date: debt.date,
            isPaid: debt.isPaid ? "שולם" : "לא שולם",
          });
        });
      } else {
        // data.push({
        //   Name: user.name,
        //   DebtSum: "אין חוב",
        //   Reason: "",
        //   Date: "N/A",
        // });
      }
    });

    // Create a worksheet from the data
    const worksheet = utils.json_to_sheet(data);

    Object.keys(worksheet).forEach((key) => {
      if (key[0] !== "!") {
        worksheet[key].s = {
          alignment: {
            horizontal: "right", // Right align to mimic RTL
          },
        };
      }
    });

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Debts");
    writeFile(workbook, `${props.name} - בעלי חוב ${getCurrentDate()}.xlsx`);
  };

  return (
    <div className="flex  gap-1">
      <Button
        onClick={handleDownload}
        variant="contained"
        startIcon={<Description />}
      >
        <span className="hidden sm:block mx-1">יצא לאקסל</span>
        <span className="sm:hidden mx-1 ">יצא</span>
      </Button>
    </div>
  );
};

export default DownloadExcelButton;
DownloadExcelButton.defaultProps = {};

interface Props {
  users: KUser[];
  name: string;
}
