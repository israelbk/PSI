import PsiRowModel from "./psi-row-model";

export default interface SinglePsiModel {
  psiData: {
    psiRowModels: PsiRowModel[];
    id: string;
  };
}
