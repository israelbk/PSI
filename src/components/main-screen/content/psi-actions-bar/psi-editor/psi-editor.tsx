import PsiInstanceStore from "../../../../../stores/psi-instance-store";
import { observer } from "mobx-react";
import "./psi-editor.scss";
import InlineTextField from "../../../../inline-render-text-number-field/inline-render-text-number-field";
import React from "react";


interface PsiEditorProps {
  store: PsiInstanceStore;
}
function PsiEditor(props: PsiEditorProps) {
  const { store } = props;


  return (
    <div className="psi-editor-wrapper">
      <div className='editor-label'>Current Editor:</div>
      <div className="editor-name">
        <InlineTextField
            onBlur={(value) => store.setCurrentEditor(value)}
            appName={store.currentEditor}
        />
      </div>
    </div>
  );
}

export default observer(PsiEditor);
