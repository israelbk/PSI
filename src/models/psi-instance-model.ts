import SinglePsiModel from "./single-psi-model";

interface PsiInstanceModel {
    psiModels: SinglePsiModel[];
    appName: string;
    currentPsiIndex: string;
    currentEditor?: string;
    admin?: boolean;
}

export default PsiInstanceModel;