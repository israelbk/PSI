import React, { useCallback } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import PsiCellStore from "../../../stores/psi-cell-store";
import { debounce } from "@mui/material";

interface PsiMatrixCellProps {
  store: PsiCellStore;
}

export default function PsiMatrixCell(props: PsiMatrixCellProps) {
  const { store } = props;

  const [editorState, setEditorState] = React.useState(() =>
      store.freeText
  );

  const debounced = useCallback(
    debounce(() => {
      store.setFreeText(editorState);
      store.onCellChanged();
    }, 1000),
    [editorState]
  );

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
    debounced();
  };

  return (
    <div style={{ width: "500px" }}>
      <Editor editorState={editorState} onChange={onEditorStateChange} />
    </div>
  );
}
