import React, { useEffect, useRef } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../../../stores/psi-cell-store";
import { observer, Observer } from "mobx-react";
import "./psi-matrix-cell.scss";
import AddIcon from "@mui/icons-material/Add";
import { Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import DataBlockViewMode from "../data-block/data-block-view-mode";

interface PsiMatrixCellProps {
  store: PsiCellStore;
}

function PsiMatrixCell(props: PsiMatrixCellProps) {
  const { store } = props;
  const editedStateRef = useRef<Editor>(null);
  const [editorState, setEditorState] = React.useState<
    EditorState | undefined
  >();

  useEffect(() => {
    setEditorState(store.currentlyEditedState?.state);
  }, [store.currentlyEditedState?.state]);

  useEffect(() => {
    if (editorState) {
      EditorState.moveFocusToEnd(editorState);
    }
  }, [editorState]);

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  function onEditModeExit() {
    if (store.currentlyEditedState != null && editorState != null)
      store.currentlyEditedState.setState(editorState);
    store.exitEditMode();
  }

  function createNewEditMode() {
    store.createNewEmptyDataBlock();
  }

  function pasteFromClipboard() {
    store.pasteFromClipboard();
  }

  function renderEditor() {
    return (
      <div className="edit-mode-text-editor-container">
        <Editor
          ref={editedStateRef}
          editorState={editorState!}
          onChange={onEditorStateChange}
          onBlur={onEditModeExit}
          onEscape={onEditModeExit}
        />
      </div>
    );
  }

  function renderActions() {
    return (
      <div className="cell-actions">
        <Observer>
          {() => (
            <>
              {store.clipboardIsNotEmpty && (
                <ContentPasteGoIcon
                  className="cta-icon"
                  onClick={() => pasteFromClipboard()}
                />
              )}
            </>
          )}
        </Observer>
        <AddIcon className="cta-icon" onClick={() => createNewEditMode()} />
      </div>
    );
  }

  function renderViewModeBlocks(provided: DroppableProvided) {
    return (
      <div className="view-mode-texts-container">
        <Observer>
          {() => (
            <>
              {store.sortedViewModeDataBlocks.map((dataBlockStore, index) => (
                <Draggable
                  draggableId={dataBlockStore.id}
                  index={index}
                  key={dataBlockStore.id}
                >
                  {(provided, snapshot) => (
                    <DataBlockViewMode
                      store={dataBlockStore}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </>
          )}
        </Observer>
      </div>
    );
  }

  return (
    <Droppable droppableId={store.id}>
      {(provided) => (
        <div
          className="psi-cell-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {renderViewModeBlocks(provided)}
          {editorState != null && renderEditor()}
          {editorState == null && renderActions()}
        </div>
      )}
    </Droppable>
  );
}

export default observer(PsiMatrixCell);
