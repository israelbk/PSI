import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PsiMatrixCell from "../psi-matrix-cell/psi-matrix-cell";
import PsiInstanceStore from "../../../../../stores/psi-instance-store";
import PsiRowStore from "../../../../../stores/psi-row-store";
import "./psi-matrix-container.scss";
import { observer } from "mobx-react";
import { DragDropContext } from "react-beautiful-dnd";
import PsiCellStore from "../../../../../stores/psi-cell-store";
import InlineTextField from "../../../../inline-render-text-number-field/inline-render-text-number-field";

interface PsiMatrixContainerProps {
  store: PsiInstanceStore;
}

function PsiMatrixContainer(props: PsiMatrixContainerProps) {
  const { store } = props;
  const currentPsi = store.currentPsiStore;

  function onItemDropped(
    sourceCellId: string,
    destCellId: string,
    itemId: string,
    destIndex: number
  ) {
    let sourceCellStore: PsiCellStore;
    let destCellStore: PsiCellStore;
    currentPsi.psiRowsStore.forEach((rowStore) => {
      if (rowStore.who.id === sourceCellId) sourceCellStore = rowStore.who;
      if (rowStore.who.id === destCellId) destCellStore = rowStore.who;

      if (rowStore.what.id === sourceCellId) sourceCellStore = rowStore.what;
      if (rowStore.what.id === destCellId) destCellStore = rowStore.what;

      if (rowStore.how.id === sourceCellId) sourceCellStore = rowStore.how;
      if (rowStore.how.id === destCellId) destCellStore = rowStore.how;
    });

    if (sourceCellStore! == null || destCellStore! == null) return;

    const draggedDataBlock = sourceCellStore.popFreeTextStateById(itemId);
    draggedDataBlock.setCellStore(destCellStore);
    destCellStore.addDataBlock(draggedDataBlock, destIndex);
  }

  return (
    <DragDropContext
      onDragEnd={({ source, destination, draggableId }) => {
        if (destination != null && destination.droppableId != null) {
          onItemDropped(
            source.droppableId,
            destination.droppableId,
            draggableId,
            destination.index
          );
        }
      }}
    >
      <div className="psi-wrapper">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center" className="left-border">
                  <div className="column-text-container">
                    <div className="column-text-editor">
                      <InlineTextField
                        onBlur={(value) => currentPsi.setColumnText(0, value)}
                        input={currentPsi.whatWhyColumnText}
                        tooltipContent="The Why / What section"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center" className="left-border">
                  <div className="column-text-container">
                    <div className="column-text-editor">
                      <InlineTextField
                        onBlur={(value) => currentPsi.setColumnText(1, value)}
                        input={currentPsi.whoColumnText}
                        tooltipContent="The Who section"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center" className="left-border">
                  <div className="column-text-container">
                    <div className="column-text-editor">
                      <InlineTextField
                        onBlur={(value) => currentPsi.setColumnText(2, value)}
                        input={currentPsi.howColumnText}
                        tooltipContent="The How section"
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPsi.psiRowsStore.map((row: PsiRowStore) => (
                <TableRow
                  key={row.phase + "-" + currentPsi.modelData.psiData.id}
                  sx={{
                    "&:last-child td, &:last-child th": { borderBlock: 0 },
                  }}
                >
                  <TableCell
                    style={{ width: "10%" }}
                    component="th"
                    scope="row"
                    className="row-phase-title"
                  >
                    <bdi dir="auto" className="right-border">
                      <InlineTextField
                        onBlur={(value) => row.setPhaseString(value)}
                        input={row.phase}
                      />
                    </bdi>
                  </TableCell>
                  <TableCell align="right" className="left-border psi-cell">
                    <PsiMatrixCell store={row.what} />
                  </TableCell>
                  <TableCell align="right" className="left-border psi-cell">
                    <PsiMatrixCell store={row.who} />
                  </TableCell>
                  <TableCell align="right" className="left-border psi-cell">
                    <PsiMatrixCell store={row.how} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </DragDropContext>
  );
}
export default observer(PsiMatrixContainer);
