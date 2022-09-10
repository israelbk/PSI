import React, { useEffect, useRef } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../../../stores/psi-cell-store";
import { observer } from "mobx-react";
import "./psi-matrix-cell.scss";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface PsiMatrixCellProps {
  store: PsiCellStore;
}

function PsiMatrixCell(props: PsiMatrixCellProps) {
  const { store } = props;
  const editedStateRef = useRef<any>(null);
  const [editorState, setEditorState] = React.useState<
    EditorState | undefined
  >();
  useEffect(() => {
    setEditorState(store.currentlyEditedState);
    if (editorState) {
      EditorState.moveFocusToEnd(editorState);
      // editedStateRef.current.focus()
    }
  }, [store.currentlyEditedId]);

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  function onEditModeExit() {
    store.setFreeText(editorState);
    store.exitEditMode();
  }

  function createNewEditMode() {
    const state = store.createNewEmptyState();
    // editedStateRef.current.focus();
    // EditorState.moveFocusToEnd(state);
  }

  function goToEditMode(id: string) {
    store.updateCurrentlyEditedState(id);
  }
  function deleteStateById(id: string) {
    store.deleteStateById(id);
  }

  return (
    <div className="psi-cell-container">
      <div className="view-mode-texts-container">
        {store.viewModeStates.map(({ id, state }) => (
          <div key={id} className="view-mode-text-area">
            <Editor
              editorState={state}
              readOnly={true}
              onChange={onEditorStateChange}
            />
            <EditIcon
              className="cta-icon edit-delete-icons"
              onClick={() => goToEditMode(id)}
            />
            <DeleteIcon
              className="cta-icon edit-delete-icons"
              onClick={() => deleteStateById(id)}
            />
          </div>
        ))}
      </div>
      {editorState != null && (
        <div className="edit-mode-text-editor-container">
          <Editor
            editorState={editorState}
            onChange={onEditorStateChange}
            onBlur={onEditModeExit}
            onEscape={onEditModeExit}
            ref={editedStateRef}
          />
        </div>
      )}
      {editorState == null && (
        <div className="add-new-text-editor-icon-container">
          <AddIcon
            className="add-new-text-editor-icon cta-icon"
            onClick={() => createNewEditMode()}
          />
        </div>
      )}
    </div>
  );
}

export default observer(PsiMatrixCell);
