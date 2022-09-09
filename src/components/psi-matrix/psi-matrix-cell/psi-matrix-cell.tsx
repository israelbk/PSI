import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../stores/psi-cell-store";
import { observer } from 'mobx-react';
import './psi-matrix-cell.scss'

interface PsiMatrixCellProps {
  store: PsiCellStore;
}

function PsiMatrixCell(props: PsiMatrixCellProps) {
  const { store } = props;

  const [editorState, setEditorState] = React.useState(
    () => store.freeTextState
  );

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
    store.setFreeText(editorState);
    // store.onCellChanged();
  };

  return (
      <>
        <div className='text-editor-container'>
          <Editor editorState={editorState} onChange={onEditorStateChange} onBlur={()=> console.log("blured")} />
        </div>
        {/*<span>{JSON.stringify(store.modelData)}</span>*/}
        {/*<span>{store.modelData}</span>*/}
      </>

  );
}

export default observer(PsiMatrixCell);
