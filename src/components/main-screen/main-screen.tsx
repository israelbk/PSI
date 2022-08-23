import React, {useMemo} from 'react';

import PsiMatrixContainer from "../psi-matrix/psi-matrix-container/psi-matrix-container";
import PsiInstanceStore from "../../stores/psi-instance-store";
import Header from "./header/header";
import './main-screen.scss'
import Footer from "./footer/footer";

function MainScreen(){
    const store = useMemo(() => new PsiInstanceStore(), []);
    return (<div className='main-app-wrapper'>
                <Header store={store}/>
                <div className='content'>
                    <PsiMatrixContainer store={store}/>
                </div>
                <Footer/>
            </div>)
}

export default MainScreen;