import React from "react";
import { Editor } from "draft-js";
import "draft-js/dist/Draft.css";
import { observer } from "mobx-react";
import "./data-block-view-mode.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DraggableProvided } from "react-beautiful-dnd";
import PsiDataBlockStore from "../../../../../stores/psi-data-block-store";
import { Tooltip } from "../../../../tooltip/tooltip";
import BlockMetaDataPreview from "./block-meta-data-preview/block-meta-data-preview";

interface PsiMatrixCellProps {
  store: PsiDataBlockStore;
  provided: DraggableProvided;
}

function DataBlockViewMode(props: PsiMatrixCellProps) {
  const { store, provided } = props;

  function copyDataBlockIntoClipboard() {
    store.copyCurrentBlockIntoClipboard();
  }
  function goToEditMode() {
    store.goToEditMode();
  }
  function deleteDataBlock() {
    store.deleteDataBlock();
  }

  return (
    <Tooltip
      disabled={!store.cellStore.instanceStore.isAdmin}
      content={<BlockMetaDataPreview store={store}/>}
      theme="light"
      interactive
    >
      <div
        key={store.id}
        ref={provided.innerRef}
        className="view-mode-text-area"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Editor
          editorState={store.state}
          readOnly={true}
          onChange={() => void 0}
        />
        <div className="cell-state-actions">
          <ContentCopyIcon
            className="cta-icon"
            onClick={() => copyDataBlockIntoClipboard()}
          />
          <EditIcon className="cta-icon" onClick={() => goToEditMode()} />
          <DeleteIcon className="cta-icon" onClick={() => deleteDataBlock()} />
        </div>
      </div>
    </Tooltip>
  );
}

export default observer(DataBlockViewMode);
