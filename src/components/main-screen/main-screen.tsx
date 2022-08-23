import React, {useMemo} from 'react';

import PsiMatrixContainer from "../psi-matrix/psi-matrix-container/psi-matrix-container";
import PsiInstanceStore from "../../stores/psi-instance-store";
import Header from "./header/header";
import './main-screen.scss'

function MainScreen(){
    const store = useMemo(() => new PsiInstanceStore(), []);
    return (<div className='main-app-wrapper'>
                <span>Gai is the king!</span>
                <Header store={store}/>
                <div className='content'>
                    <PsiMatrixContainer store={store}/>
                </div>
                <div className='footer'/>
            </div>)
}

export default MainScreen;