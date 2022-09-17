
export default interface PsiDataBlockModel {
    id: string;
    text: string;
    creationData: EditMetaData;
    editingHistory: EditMetaData[];
}

export interface EditMetaData {
    user: string;
    timestamp: number;
}
