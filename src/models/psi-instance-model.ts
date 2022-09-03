import SinglePsiModel from "./single-psi-model";

interface PsiInstanceModel {
    psiModels: SinglePsiModel[];
    appName: string;
    currentPsiIndex: string;
}

export default PsiInstanceModel;