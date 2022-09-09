import React, { useMemo } from "react";

import PsiMatrixContainer from "../psi-matrix/psi-matrix-container/psi-matrix-container";
import PsiInstanceStore from "../../stores/psi-instance-store";
import Header from "./header/header";
import "./main-screen.scss";
import Footer from "./footer/footer";
import PsiScroller from "./psi-scroller/psi-scroller";
import PsiActions from "./psi-actions/psi-actions";
import { observer } from "mobx-react";

function MainScreen() {
  const store = useMemo(() => new PsiInstanceStore(), []);
  return (
    <div className="main-app-wrapper">
      <Header store={store} />
      <div className="content">
        <PsiActions store={store} />
        <PsiMatrixContainer store={store} />
        <PsiScroller store={store} />
      </div>
      <Footer />
    </div>
  );
}

export default observer(MainScreen);
