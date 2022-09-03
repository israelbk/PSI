import PsiInstanceStore from "../../../stores/psi-instance-store";
import { Tooltip } from "../../tooltip/tooltip";
import { Button } from "@mui/material";
import { observer, Observer } from "mobx-react";
import { useState } from "react";
import "./psi-actions.scss";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PsiActionOption from "./psi-action-option/psi-action-option";

interface PsiActionsProps {
  store: PsiInstanceStore;
}
function PsiActions(props: PsiActionsProps) {
  const { store } = props;
  const [psiActionsIsOpen, setPsiActionsIsOpen] = useState(false);
  const disableDeletePsi = store.psisStore.length === 1;

  function createNewPsi() {
      store.createNewPsi();
  }

  function DeleteCurrentPsi() {
      store.createNewPsi();
  }

  function renderPsiActionsOptions() {
    return (
      <div className="psi-actions-drop-down-wrapper">
          <PsiActionOption text="Add a blank psi" onClick={() => createNewPsi()} renderIcon={() => <AddIcon/>}/>
          <PsiActionOption text="Import new psi" onClick={() => createNewPsi()} renderIcon={() => <AddIcon/>}/>
          <PsiActionOption text="Export current psi" onClick={() => createNewPsi()} renderIcon={() => <AddIcon/>}/>
          <PsiActionOption text="Delete current psi" onClick={() => DeleteCurrentPsi()} renderIcon={() => <DeleteIcon/>} disabled={disableDeletePsi}/>
      </div>
    );
  }

  return (
    <div className="psi-actions-wrapper">
      <Tooltip
        trigger="click"
        interactive
        content={renderPsiActionsOptions()}
        theme="light"
        placement="right-end"
        visible={psiActionsIsOpen}
        onClickOutside={() => setPsiActionsIsOpen(false)}
      >
        <Observer>
          {() => (
            <Button
              variant="outlined"
              className="psi-actions-button"
              onClick={() => setPsiActionsIsOpen((open) => !open)}
            >
              Actions
            </Button>
          )}
        </Observer>
      </Tooltip>
    </div>
  );
}

export default observer(PsiActions);
