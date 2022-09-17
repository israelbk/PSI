import PsiCellDataBlockModel from "./psi-cell-editor-model";

export default interface PsiCellModel {
    dataBlocks: PsiCellDataBlockModel[];
    row: string;
    column: string;
    id: string
}
