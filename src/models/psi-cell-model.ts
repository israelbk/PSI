
export default interface PsiCellModel {
    freeText: TextEntry[];
    row: string;
    column: string;
}

export interface TextEntry {
    id: string;
    text: string;
}