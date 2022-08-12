import React, {useMemo} from 'react';

import PsiMatrixContainer from "../psi-matrix/psi-matrix-container";
import PsiInstanceStore from "../../stores/psi-instance-store";

function MainScreen(){
    const store = useMemo(() => new PsiInstanceStore(), []);
    return <PsiMatrixContainer store={store}/>
}

export default MainScreen;