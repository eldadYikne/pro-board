import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Ktable(props: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.rowsData.map((row) => {
              return <TableCell align="right"> {row}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.columnData.map((row) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              key={row.name}
            >
              {/* <TableCell component="th" scope="row">
                {row.name}
              </TableCell> */}
              {Object.keys(row).map((key: string) => {
                return key === "action" ? (
                  row[key].map((action: any) => (
                    <Button>{action.actionName} </Button>
                  ))
                ) : (
                  <TableCell align="right">{row[key]}</TableCell>
                );
              })}
              {/* <TableCell component="th" scope="row">
                {row.name}
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
Ktable.defaultProps = {
  parasha: "",
  zmanim: undefined,
  isMoridHatal: false,
  omerDays: "",
};

interface Props {
  rowsData: any[];
  columnData: any[];
}
