import React, { useMemo } from "react";

import PsiMatrixContainer from "./content/psi-matrix/psi-matrix-container/psi-matrix-container";
import PsiInstanceStore from "../../stores/psi-instance-store";
import Header from "./header/header";
import "./main-screen.scss";
import Footer from "./footer/footer";
import PsiScroller from "./content/psi-scroller/psi-scroller";
import { observer } from "mobx-react";
import PsiActionsBar from "./content/psi-actions-bar/psi-actions-bar";

function MainScreen() {
  const store = useMemo(() => new PsiInstanceStore(), []);
  return (
    <div className="main-app-wrapper">
      <Header store={store} />
      <div className="content">
        <PsiActionsBar store={store} />
        <PsiMatrixContainer store={store} />
        <PsiScroller store={store} />
      </div>
      <Footer />
    </div>
  );
}

export default observer(MainScreen);
