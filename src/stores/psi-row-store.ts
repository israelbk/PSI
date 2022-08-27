import {action, computed, observable} from "mobx";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiCellStore from "./psi-cell-store";
import PsiRowModel from "../models/psi-row-model";
import SinglePsiStore from "./single-psi-store";

export default class PsiRowStore implements JsonSerializable<PsiRowModel> {
  rowNum!: number;
  @observable phase!: string;
  @observable what!: PsiCellStore;
  @observable who!: PsiCellStore;
  @observable how!: PsiCellStore;

  constructor(
    readonly singlePsiStore: SinglePsiStore,
    psiRowModel: PsiRowModel
  ) {
    this.initData(psiRowModel);
  }

  @action initData(rowModel: PsiRowModel) {
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

  onCellChanged() {
    this.singlePsiStore.onCellChanged();
  }

  toJSON(): PsiRowModel {
    return {
      rowNum: this.rowNum.toString(),
      phase: this.phase,
      data: {
        what: this.what.toJSON(),
        who: this.who.toJSON(),
        how: this.how.toJSON(),
      },
    };
  }

  @computed get modelData(): PsiRowModel{
    const json = {
      rowNum: this.rowNum.toString(),
      phase: this.phase,
      data: {
        what: this.what.modelData,
        who: this.who.modelData,
        how: this.how.modelData,
      },
    }


    console.log('row store' , json);
    return json;
  }
}
