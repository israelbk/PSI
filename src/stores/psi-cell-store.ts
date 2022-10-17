import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
} from "mobx";
import { EditorState } from "draft-js";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiCellModel from "../interfaces/psi-cell-model";
import PsiRowStore from "./psi-row-store";
import { v4 as uuid } from "uuid";
import PsiInstanceStore from "./psi-instance-store";
import PsiCellDataBlockModel, {
  EditMetaData,
} from "../interfaces/psi-data-block-model";
import PsiDataBlockStore from "./psi-data-block-store";
import PsiDataBlockModel from "../interfaces/psi-data-block-model";

export default class PsiCellStore implements JsonSerializable<PsiCellModel> {
  @observable dataBlocks!: ObservableMap<string, PsiDataBlockStore>;
  @observable currentlyEditedId?: string;
  row!: number;
  column!: number;
  id!: string;

  constructor(
    readonly psiRowStore: PsiRowStore,
    json?: PsiCellModel,
    row?: number,
    column?: number
  ) {
    makeObservable(this);
    this.initData(json, row, column);
  }

  @action popFreeTextStateById(id: string): PsiDataBlockStore {
    const dataBlock = this.dataBlocks.get(id);
    this.deleteStateById(id);
    return dataBlock!;
  }

  @action private initData(json?: PsiCellModel, row?: number, column?: number) {
    this.dataBlocks = observable.map();
    if (json !== undefined) {
      this.updateFromJson(json);
    } else {
      this.row = row!;
      this.column = column!;
      this.id = uuid();
    }
  }

  @action createNewEmptyDataBlock(): EditorState {
    const newDataBlock = new PsiDataBlockStore(this);
    this.dataBlocks.set(newDataBlock.id, newDataBlock);
    this.currentlyEditedId = newDataBlock.id;
    return newDataBlock.state;
  }

  @action addDataBlock(dataBlock: PsiDataBlockStore, destIndex: number) {
    if (destIndex === 0) {
      dataBlock.blockIndex =
        (this.sortedViewModeDataBlocks[0]?.blockIndex ?? 0) - 1;
    } else if (destIndex === this.sortedViewModeDataBlocks.length) {
      dataBlock.blockIndex =
        (this.sortedViewModeDataBlocks.at(-1)?.blockIndex ?? 0) + 1;
    } else {
      dataBlock.blockIndex =
        (this.sortedViewModeDataBlocks[destIndex].blockIndex +
          this.sortedViewModeDataBlocks[destIndex - 1].blockIndex) /
        2;
    }

    this.dataBlocks.set(dataBlock.id, dataBlock);
  }

  @action pasteFromClipboard() {
    const copiedBlock = this.instanceStore.dataBlockClipboard;
    if (copiedBlock == null) return;
    const modelData = copiedBlock.modelData;
    modelData.id = uuid();
    modelData.editingHistory = [];
    modelData.creationData = this.getMetaData();
    const newBlockData = new PsiDataBlockStore(this, modelData);
    newBlockData.blockIndex = this.lastBlockIndex + 1
    this.dataBlocks.set(newBlockData.id, newBlockData);
    this.instanceStore.setStateClipboard(undefined);
  }

  @action updateCurrentlyEditedState(id: string) {
    this.currentlyEditedId = id;
  }

  @action deleteStateById(id: string) {
    if (this.currentlyEditedId === id) this.currentlyEditedId = undefined;
    this.dataBlocks.delete(id);
  }

  @action exitEditMode() {
    this.currentlyEditedId = undefined;
  }

  @action updateFromJson(json: PsiCellModel) {
    if (json.freeText != null) {
      json.dataBlocks = json.freeText.map((freeTextEntry: any) => {
        return {
          id: freeTextEntry.id,
          text: freeTextEntry.text,
          creationData: this.getMetaData(),
          editingHistory: [],
        };
      });
      delete json.freeText;
    }

    json.dataBlocks.forEach((dataBlockModel: PsiCellDataBlockModel) => {
      this.dataBlocks.set(
        dataBlockModel.id,
        new PsiDataBlockStore(this, dataBlockModel)
      );
    });
    this.row = Number(json.row);
    this.column = Number(json.column);
    this.id = json.id ?? uuid();
  }

  @computed get sortedViewModeDataBlocks(): PsiDataBlockStore[] {
    let viewModeDataBlocks: PsiDataBlockStore[] = [];
    this.dataBlocks.forEach((dataBlockStore, dataBlockId) => {
      if (dataBlockId !== this.currentlyEditedId) {
        viewModeDataBlocks.push(dataBlockStore);
      }
    });
    return viewModeDataBlocks.sort((a, b) =>
      a.blockIndex > b.blockIndex ? 1 : -1
    );
  }

  @computed get currentlyEditedState(): PsiDataBlockStore | undefined {
    return this.currentlyEditedId
      ? this.dataBlocks.get(this.currentlyEditedId) ?? undefined
      : undefined;
  }

  @computed get clipboardIsNotEmpty(): boolean {
    return this.instanceStore.dataBlockClipboard != null;
  }

  @computed get instanceStore(): PsiInstanceStore {
    return this.psiRowStore.singlePsiStore.psiInstanceStore;
  }

  @computed get lastBlockIndex(): number {
    const lastBlockIndex =Number(this.sortedViewModeDataBlocks.at(-1)?.blockIndex);
    return isNaN(lastBlockIndex) ? 0 : lastBlockIndex;
  }

  @computed get modelData(): PsiCellModel {
    const dataBlocks: PsiDataBlockModel[] = [];
    this.dataBlocks.forEach((value, key) => {
      dataBlocks.push(value.modelData);
    });

    return {
      dataBlocks: dataBlocks,
      row: this.row.toString(),
      column: this.column.toString(),
      id: this.id,
    };
  }

  getMetaData = (): EditMetaData => {
    return {
      user: this.instanceStore.currentEditor,
      timestamp: Date.now(),
    };
  };
}
