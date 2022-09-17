import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
} from "mobx";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import JsonSerializable from "../interfaces/JsonSerializable";
import { v4 as uuid } from "uuid";
import { EditMetaData } from "../models/psi-data-block-model";
import PsiDataBlockModel from "../models/psi-data-block-model";
import PsiCellStore from "./psi-cell-store";

export default class PsiDataBlockStore
  implements JsonSerializable<PsiDataBlockModel>
{
  @observable id!: string;
  @observable state!: EditorState;
  @observable creationData!: EditMetaData;
  @observable editingHistory!: IObservableArray<EditMetaData>;

  constructor(readonly cellStore: PsiCellStore, json?: PsiDataBlockModel) {
    makeObservable(this);
    this.initData(json);
  }

  @action private initData(json?: PsiDataBlockModel) {
    if (json !== undefined) {
      this.updateFromJson(json);
    } else {
      this.id = uuid();
      this.editingHistory = observable.array();
      this.state = EditorState.createEmpty();
      this.creationData = this.cellStore.getMetaData();
    }
  }

  @action copyCurrentBlockIntoClipboard() {
    this.cellStore.instanceStore.setStateClipboard(this);
  }

  @action deleteDataBlock() {
    this.cellStore.deleteStateById(this.id);
  }

  @action goToEditMode() {
    this.cellStore.updateCurrentlyEditedState(this.id);
  }

  @action setState(state: EditorState) {
    this.state = state;
    this.editingHistory.push(this.cellStore.getMetaData())
  }

  @action updateFromJson(json: PsiDataBlockModel) {
    const contentState = convertFromRaw(JSON.parse(json.text));
    this.state = EditorState.createWithContent(contentState);
    this.id = json.id ?? uuid();
    this.creationData = json.creationData ?? this.cellStore.getMetaData();
    this.editingHistory = observable.array(json.editingHistory ?? []);
  }

  @computed get modelData(): PsiDataBlockModel {
    const extractedState = JSON.stringify(
      convertToRaw(this.state.getCurrentContent())
    );

    return {
      id: this.id,
      text: extractedState,
      creationData: this.creationData,
      editingHistory: this.editingHistory,
    };
  }
}
