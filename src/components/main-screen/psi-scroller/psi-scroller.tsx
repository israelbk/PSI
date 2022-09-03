import PsiInstanceStore from "../../../stores/psi-instance-store";
import { observer } from "mobx-react";
import "./psi-scroller.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { getClasses } from "../../../utils/utils";

interface PsiScrollerProps {
  store: PsiInstanceStore;
}

function PsiScroller(props: PsiScrollerProps) {
  const { store } = props;
  const psiIndexString = `PSI ${store.currentPsiIndex + 1}/${
    store.psisStore.length
  }`;

  function onLeftArrowClicked(){
      if(store.currentPsiIndex !== 0){
          store.setCurrentPsiIndex(store.currentPsiIndex-1)
      }
  }

  function onRightArrowClicked(){
      if(store.currentPsiIndex + 1 < store.psisStore.length){
          store.setCurrentPsiIndex(store.currentPsiIndex+1)
      }
  }

  return (
    <div className="psi-scroller-container">
      <ArrowLeftIcon
        className={getClasses(
          "psi-scroller-arrow",
          store.currentPsiIndex === 0 && "disabled"
        )}
        onClick={()=>onLeftArrowClicked()}
      />
      <div>{psiIndexString}</div>
      <ArrowRightIcon
        className={getClasses(
          "psi-scroller-arrow",
          store.currentPsiIndex + 1 >= store.psisStore.length && "disabled"
        )}
        onClick={()=>onRightArrowClicked()}
      />
    </div>
  );
}

export default observer(PsiScroller);