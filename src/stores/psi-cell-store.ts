import { action, computed, observable } from "mobx";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiCellModel from "../models/psi-cell-model";
import PsiRowStore from "./psi-row-store";

export default class PsiCellStore implements JsonSerializable<PsiCellModel> {
  @observable freeTextState!: EditorState;
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
      this.freeTextState = EditorState.createEmpty();
      this.row = row!;
      this.column = column!;
    }
  }

  @action setFreeText(newValue: EditorState) {
    this.freeTextState = newValue;
    console.log("free text changed", JSON.stringify(convertToRaw(this.freeTextState.getCurrentContent())));
  }

  onCellChanged() {
    this.psiRowStore.onCellChanged();
  }

  @action updateFromJson(json: PsiCellModel) {
    const contentState = convertFromRaw(JSON.parse(json.freeText));
    this.freeTextState = EditorState.createWithContent(contentState);
    this.row = Number(json.row);
    this.column = Number(json.column);
  }

  toJSON(): PsiCellModel {
    return {
      freeText: JSON.stringify(convertToRaw(this.freeTextState.getCurrentContent())),
      row: this.row.toString(),
      column: this.column.toString(),
    };
  }

  @computed get freeTextToSave(): string {
    const json = JSON.stringify(
      convertToRaw(this.freeTextState.getCurrentContent())
    );
    console.log("freeTextToSave", json);

    return json;
  }

  @computed get modelData(): PsiCellModel {
    const json = {
      freeText: this.freeTextToSave,
      row: this.row.toString(),
      column: this.column.toString(),
    };

    console.log("cell store", json);
    return json;
  }
}
