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
import PsiDataBlockModel, {
  EditMetaData,
} from "../interfaces/psi-data-block-model";
import PsiCellStore from "./psi-cell-store";

export default class PsiDataBlockStore
  implements JsonSerializable<PsiDataBlockModel>
{
  @observable id!: string;
  @observable state!: EditorState;
  @observable creationData!: EditMetaData;
  @observable editingHistory!: IObservableArray<EditMetaData>;
  @observable blockIndex!: number;
  @observable cellStore!: PsiCellStore;

  constructor(cellStore: PsiCellStore, json?: PsiDataBlockModel) {
    makeObservable(this);
    this.cellStore = cellStore;
    this.initData(json);
  }

  @computed get sortedEditingHistory(): IObservableArray<EditMetaData> {
    return this.editingHistory.sort((a, b) =>
      a.timestamp > b.timestamp ? 1 : -1
    );
  }

  @action private initData(json?: PsiDataBlockModel) {
    if (json !== undefined) {
      this.updateFromJson(json);
    } else {
      this.id = uuid();
      this.editingHistory = observable.array();
      this.state = EditorState.createEmpty();
      this.creationData = this.cellStore.getMetaData();
      this.blockIndex = this.cellStore.lastBlockIndex + 1;
    }
  }

  @action copyCurrentBlockIntoClipboard() {
    this.cellStore.instanceStore.setStateClipboard(this);
  }

  @action setCellStore(cellStore: PsiCellStore) {
    this.cellStore = cellStore;
  }

  @action deleteDataBlock() {
    this.cellStore.deleteStateById(this.id);
  }

  @action goToEditMode() {
    this.cellStore.updateCurrentlyEditedState(this.id);
  }

  @action setState(state: EditorState) {
    this.state = state;
    this.editingHistory.push(this.cellStore.getMetaData());
  }

  @action updateFromJson(json: PsiDataBlockModel) {
    const contentState = convertFromRaw(JSON.parse(json.text));
    this.state = EditorState.createWithContent(contentState);
    this.id = json.id ?? uuid();
    this.creationData = json.creationData ?? this.cellStore.getMetaData();
    this.editingHistory = observable.array(json.editingHistory ?? []);
    this.blockIndex = isNaN(Number(json.blockIndex))
      ? this.cellStore.lastBlockIndex + 1
      : Number(json.blockIndex);
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
      blockIndex: this.blockIndex.toString(),
    };
  }
}
