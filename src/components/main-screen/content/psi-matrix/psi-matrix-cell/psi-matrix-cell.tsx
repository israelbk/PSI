import React, { useEffect, useRef } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../../../stores/psi-cell-store";
import { observer } from "mobx-react";
import "./psi-matrix-cell.scss";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Droppable, Draggable } from 'react-beautiful-dnd';

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

  function goToEditMode(id: string) {
    store.updateCurrentlyEditedState(id);
  }
  function deleteStateById(id: string) {
    store.deleteStateById(id);
  }

  return (
    <Droppable droppableId={store.id}>
      {(provided) => 
      <div className="psi-cell-container" ref={provided.innerRef} {...provided.droppableProps}>
        <div className="view-mode-texts-container">
          {store.viewModeStates.map(({ id, state }, index) => (
            <Draggable draggableId={id} index={index} key={id}>
              {(provided, snapshot) =>
                <div key={id} ref={provided.innerRef} className="view-mode-text-area" {...provided.draggableProps} {...provided.dragHandleProps} >
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
              }
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
        {editorState != null && (
          <div className="edit-mode-text-editor-container">
            <Editor
              ref={editedStateRef}
              editorState={editorState}
              onChange={onEditorStateChange}
              onBlur={onEditModeExit}
              onEscape={onEditModeExit}
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
      </div>}
    </Droppable>
  );
}

export default observer(PsiMatrixCell);
