import { observer } from "mobx-react";
import "./psi-actions-bar.scss";
import PsiActions from "./psi-actions/psi-actions";
import PsiEditor from "./psi-editor/psi-editor";
import PsiInstanceStore from "../../../../stores/psi-instance-store";


interface PsiEditorProps {
  store: PsiInstanceStore;
}
function PsiActionsBar(props: PsiEditorProps) {
  const { store } = props;


  return (
    <div className="psi-actions-bar-wrapper">
          <PsiActions store={store}/>
          <PsiEditor store={store}/>
    </div>
  );
}

export default observer(PsiActionsBar);
