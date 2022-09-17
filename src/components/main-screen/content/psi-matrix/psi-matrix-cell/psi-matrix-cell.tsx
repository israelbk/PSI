import React, { useEffect, useRef } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../../../stores/psi-cell-store";
import { observer, Observer } from "mobx-react";
import "./psi-matrix-cell.scss";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";

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
    setEditorState(store.currentlyEditedState);
  }, [store.currentlyEditedState]);

  useEffect(() => {
    if (editorState) {
      EditorState.moveFocusToEnd(editorState);
    }
  }, [editorState]);

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  function onEditModeExit() {
    store.setFreeText(editorState);
    store.exitEditMode();
  }

  function createNewEditMode() {
    store.createNewEmptyState();
  }

  function pasteFromClipboard() {
    store.pasteFromClipboard();
  }

  function copyStateIntoClipboard(id: string) {
    store.copyStateIntoClipboard(id);
  }
  function goToEditMode(id: string) {
    store.updateCurrentlyEditedState(id);
  }
  function deleteStateById(id: string) {
    store.deleteStateById(id);
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

  return (
    <Droppable droppableId={store.id}>
      {(provided) => (
        <div
          className="psi-cell-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="view-mode-texts-container">
            <Observer>
              {() => (
                <>
                  {store.viewModeStates.map(({ id, state }, index) => (
                    <Draggable draggableId={id} index={index} key={id}>
                      {(provided, snapshot) => (
                        <div
                          key={id}
                          ref={provided.innerRef}
                          className="view-mode-text-area"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Editor
                            editorState={state}
                            readOnly={true}
                            onChange={onEditorStateChange}
                          />
                          <div className="cell-state-actions">
                            <ContentCopyIcon
                              className="cta-icon"
                              onClick={() => copyStateIntoClipboard(id)}
                            />
                            <EditIcon
                              className="cta-icon"
                              onClick={() => goToEditMode(id)}
                            />
                            <DeleteIcon
                              className="cta-icon"
                              onClick={() => deleteStateById(id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </>
              )}
            </Observer>
          </div>
          {editorState != null && renderEditor()}
          {editorState == null && renderActions()}
        </div>
      )}
    </Droppable>
  );
}

export default observer(PsiMatrixCell);
