import PsiCellDataBlockModel from "./psi-data-block-model";

export default interface PsiCellModel {
  dataBlocks: PsiCellDataBlockModel[];
  row: string;
  column: string;
  id: string;

  // Old versions support can be deleted.
  freeText?: any;
}
