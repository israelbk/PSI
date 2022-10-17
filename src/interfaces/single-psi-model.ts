import PsiRowModel from "./psi-row-model";

export default interface SinglePsiModel {
  psiData: {
    id: string;
    psiRowModels: PsiRowModel[];
    columnsText: string[];
    psiName: string;
  };
}
