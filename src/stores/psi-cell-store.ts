import { action, observable } from "mobx";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiCellModel from "../models/psi-cell-model";
import PsiRowStore from "./psi-row-store";

export default class PsiCellStore implements JsonSerializable<PsiCellModel> {
  @observable freeText!: EditorState;
  row!: number;
  column!: number;

  constructor(
    readonly psiRowStore: PsiRowStore,
    json?: PsiCellModel,
    row?: number,
    column?: number
  ) {
    this.initData(json, row, column);
  }

  @action private initData(json?: PsiCellModel, row?: number, column?: number) {
    if (json !== undefined) {
      this.updateFromJson(json);
    } else {
      this.freeText = EditorState.createEmpty();
      this.row = row!;
      this.column = column!;
    }
  }

  @action setFreeText(newValue: EditorState) {
    this.freeText = newValue;
  }

  onCellChanged() {
    this.psiRowStore.onCellChanged();
  }

  @action updateFromJson(json: PsiCellModel) {
    const contentState = convertFromRaw(JSON.parse(json.freeText));
    this.freeText = EditorState.createWithContent(contentState);
    this.row = Number(json.row);
    this.column = Number(json.column);
  }

  toJSON(): PsiCellModel {
    return {
      freeText: JSON.stringify(convertToRaw(this.freeText.getCurrentContent())),
      row: this.row.toString(),
      column: this.column.toString(),
    };
  }
}