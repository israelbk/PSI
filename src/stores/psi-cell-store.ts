import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
} from "mobx";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiCellModel, { TextEntry } from "../models/psi-cell-model";
import PsiRowStore from "./psi-row-store";
import { v4 as uuid } from "uuid";

export default class PsiCellStore implements JsonSerializable<PsiCellModel> {
  @observable freeTextStates!: ObservableMap<string, EditorState>;
  @observable currentlyEditedId?: string;
  row!: number;
  column!: number;

  constructor(
    readonly psiRowStore: PsiRowStore,
    json?: PsiCellModel,
    row?: number,
    column?: number
  ) {
    makeObservable(this);
    this.initData(json, row, column);
  }

  @action private initData(json?: PsiCellModel, row?: number, column?: number) {
    this.freeTextStates = observable.map();
    if (json !== undefined) {
      this.updateFromJson(json);
    } else {
      this.row = row!;
      this.column = column!;
    }
  }

  @action createNewEmptyState(): EditorState {
    const id = uuid();
    const state = EditorState.createEmpty();
    this.freeTextStates.set(id, state);
    this.currentlyEditedId = id;
    return state;
  }

  @action updateCurrentlyEditedState(id: string) {
    this.currentlyEditedId = id;
  }

  @action deleteStateById(id: string) {
    if (this.currentlyEditedId === id) this.currentlyEditedId = undefined;
    this.freeTextStates.delete(id);
  }

  @action setFreeText(newValue?: EditorState) {
    if (
      newValue != null &&
      this.currentlyEditedId &&
      this.freeTextStates.has(this.currentlyEditedId)
    ) {
      this.freeTextStates.set(this.currentlyEditedId, newValue);
    }
  }

  @action exitEditMode() {
    this.currentlyEditedId = undefined;
  }

  @action updateFromJson(json: PsiCellModel) {
    json.freeText.forEach((freeTextEntry: TextEntry) => {
      const contentState = convertFromRaw(JSON.parse(freeTextEntry.text));
      const freeTextState: EditorState =
        EditorState.createWithContent(contentState);
      this.freeTextStates.set(freeTextEntry.id, freeTextState);
    });
    this.row = Number(json.row);
    this.column = Number(json.column);
  }

  @computed get viewModeStates(): { id: string; state: EditorState }[] {
    const viewModeStates: { id: string; state: EditorState }[] = [];
    this.freeTextStates.forEach((textState, key) => {
      if (key !== this.currentlyEditedId) {
        viewModeStates.push({ id: key, state: textState });
      }
    });
    return viewModeStates;
  }

  @computed get currentlyEditedState(): EditorState | undefined {
    return this.currentlyEditedId
      ? this.freeTextStates.get(this.currentlyEditedId) ?? undefined
      : undefined;
  }

  @computed get modelData(): PsiCellModel {
    const freeTexts: TextEntry[] = [];
    this.freeTextStates.forEach((value, key) => {
      const extractedText = JSON.stringify(
        convertToRaw(value.getCurrentContent())
      );
      freeTexts.push({ id: key, text: extractedText });
    });

    return {
      freeText: freeTexts,
      row: this.row.toString(),
      column: this.column.toString(),
    };
  }
}
