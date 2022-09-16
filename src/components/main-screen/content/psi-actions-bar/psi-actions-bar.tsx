import { observer } from "mobx-react";
import "./psi-actions-bar.scss";
import PsiActions from "./psi-actions/psi-actions";
import PsiInstanceStore from "../../../../stores/psi-instance-store";
import InlineTextField from "../../../inline-render-text-number-field/inline-render-text-number-field";
import React from "react";

interface PsiEditorProps {
  store: PsiInstanceStore;
}
function PsiActionsBar(props: PsiEditorProps) {
  const { store } = props;

  return (
    <div className="psi-actions-bar-wrapper">
      <PsiActions store={store} />
      <div className="psi-name-container">
        <InlineTextField
          onBlur={(value: string) => store.currentPsiStore.setPsiName(value)}
          input={store.currentPsiStore.psiName}
          tooltipContent="Enter title for this PSI"
        />
      </div>
    </div>
  );
}

export default observer(PsiActionsBar);
