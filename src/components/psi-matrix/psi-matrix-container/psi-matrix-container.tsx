import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PsiMatrixCell from "../psi-matrix-cell/psi-matrix-cell";
import PsiInstanceStore from "../../../stores/psi-instance-store";
import PsiRowStore from "../../../stores/psi-row-store";
import "./psi-matrix-container.scss";
import {observer} from "mobx-react";

interface PsiMatrixContainerProps {
  store: PsiInstanceStore;
}

function PsiMatrixContainer(props: PsiMatrixContainerProps) {
  const { store } = props;
  const currentPsi = store.currentPsiStore;
  return (
    <div className="psi-wrapper">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Why / What</TableCell>
              <TableCell align="center">Who</TableCell>
              <TableCell align="center">How</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPsi.psiRowsStore.map((row: PsiRowStore) => (
              <TableRow
                key={row.phase+"-"+currentPsi.modelData.psiData.id}
                sx={{ "&:last-child td, &:last-child th": { borderBlock: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <bdi dir="auto" className="right-border">
                    {row.phase}
                  </bdi>
                </TableCell>
                <TableCell align="right" className="left-border">
                  <PsiMatrixCell store={row.what} />
                </TableCell>
                <TableCell align="right" className="left-border">
                  <PsiMatrixCell store={row.who} />
                </TableCell>
                <TableCell align="right" className="left-border">
                  <PsiMatrixCell store={row.how} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default observer(PsiMatrixContainer);
