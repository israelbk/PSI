import React from "react";
import PsiInstanceStore from "../../../../stores/psi-instance-store";
import { observer } from "mobx-react";
import "./psi-scroller.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { getClasses } from "../../../../utils/utils";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface PsiScrollerProps {
  store: PsiInstanceStore;
}

function PsiScroller(props: PsiScrollerProps) {
  const { store } = props;
  const psiIndexString = `PSI ${store.currentPsiIndex + 1}/${
    store.psisStore.length
  }`;

  function onLeftArrowClicked() {
    if (store.currentPsiIndex !== 0) {
      store.setCurrentPsiIndex(store.currentPsiIndex - 1);
    }
  }

  function onRightArrowClicked() {
    if (store.currentPsiIndex + 1 < store.psisStore.length) {
      store.setCurrentPsiIndex(store.currentPsiIndex + 1);
    }
  }

  function AddNewRow() {
    store.currentPsiStore.AddNewRow();
  }

  return (
    <div className="psi-footer-actions-container">
      <div className="psi-row-create-container">
        <Button
          variant="outlined"
          className="psi-actions-button"
          onClick={() => AddNewRow()}
          startIcon={<AddIcon />}
        >
          Add Row
        </Button>
      </div>
      <div className="psi-scroller-container">
        <ArrowLeftIcon
          className={getClasses(
            "psi-scroller-arrow",
            store.currentPsiIndex === 0 && "disabled"
          )}
          onClick={() => onLeftArrowClicked()}
        />
        <div>{psiIndexString}</div>
        <ArrowRightIcon
          className={getClasses(
            "psi-scroller-arrow",
            store.currentPsiIndex + 1 >= store.psisStore.length && "disabled"
          )}
          onClick={() => onRightArrowClicked()}
        />
      </div>
    </div>
  );
}

export default observer(PsiScroller);
