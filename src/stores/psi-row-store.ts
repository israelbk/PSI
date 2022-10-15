import { action, computed, makeObservable, observable } from "mobx";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiCellStore from "./psi-cell-store";
import PsiRowModel from "../interfaces/psi-row-model";
import SinglePsiStore from "./single-psi-store";
import {v4 as uuid} from "uuid";

export default class PsiRowStore implements JsonSerializable<PsiRowModel> {
  rowNum!: number;
  id! :string;
  @observable phase!: string;
  @observable what!: PsiCellStore;
  @observable who!: PsiCellStore;
  @observable how!: PsiCellStore;

  constructor(
    readonly singlePsiStore: SinglePsiStore,
    psiRowModel: PsiRowModel
  ) {
    makeObservable(this);
    this.initData(psiRowModel);
  }

  @action initData(rowModel: PsiRowModel) {
    this.id = uuid()
    this.phase = rowModel.phase;
    this.rowNum = Number(rowModel.rowNum);
    if (rowModel.data != null) {
      this.updateFromJson(rowModel);
    } else {
      this.what = new PsiCellStore(this, undefined, this.rowNum, 0);
      this.who = new PsiCellStore(this, undefined, this.rowNum, 1);
      this.how = new PsiCellStore(this, undefined, this.rowNum, 2);
    }
  }

  @action updateFromJson(json: PsiRowModel) {
    this.what = new PsiCellStore(this, json.data!.what);
    this.who = new PsiCellStore(this, json.data!.who);
    this.how = new PsiCellStore(this, json.data!.how);
  }

  @action setPhaseString(phase: string) {
    this.phase = phase;
  }

  @computed get shouldAllowDelete(): boolean {
    return this.rowNum > 2;
  }

  @computed get modelData(): PsiRowModel {
    const json = {
      rowNum: this.rowNum.toString(),
      phase: this.phase,
      data: {
        what: this.what.modelData,
        who: this.who.modelData,
        how: this.how.modelData,
      },
    };
    return json;
  }
}
