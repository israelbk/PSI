import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../stores/psi-cell-store";

interface PsiMatrixCellProps {
  store: PsiCellStore;
}

export default function PsiMatrixCell(props: PsiMatrixCellProps) {
  const { store } = props;

  const [editorState, setEditorState] = React.useState(() => store.freeText);

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
    store.setFreeText(editorState);
    store.onCellChanged();
  };

  return (
    <div style={{ width: "500px" }}>
      <Editor editorState={editorState} onChange={onEditorStateChange} />
    </div>
  );
}
