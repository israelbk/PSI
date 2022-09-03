import {action, computed, IObservableArray, observable} from "mobx";
import JsonSerializable from "../interfaces/JsonSerializable";
import SinglePsiModel from "../models/single-psi-model";
import PsiInstanceStore from "./psi-instance-store";
import { v4 as uuid } from 'uuid';
import PsiRowStore from "./psi-row-store";

export default class SinglePsiStore
  implements JsonSerializable<SinglePsiModel>
{
  private psiId: string;
  @observable psiRowsStore!: IObservableArray<PsiRowStore>;

  constructor(
    readonly psiInstanceStore: PsiInstanceStore,
    SinglePsiModel?: SinglePsiModel
  ) {
    this.psiId = SinglePsiModel?.id ?? uuid();
    this.initData(SinglePsiModel);
  }

  defaultRowsData: Map<number, string> = new Map<number, string>([
    [0, "Ethos/Vision"],
    [1, "Counseling/ Reflection"],
    [2, "Daily life"],
  ]);

  @action initData(SinglePsiModel?: SinglePsiModel) {
    if (SinglePsiModel != null) {
      this.updateFromJson(SinglePsiModel);
    } else {
      let psiCells: PsiRowStore[] = [];
      for (let i = 0; i < 3; i++) {
        psiCells.push(
          new PsiRowStore(this, {
            rowNum: i.toString(),
            phase: this.defaultRowsData.get(i)!,
          })
        );
      }
      this.psiRowsStore = observable.array<PsiRowStore>(psiCells);
    }
  }

  @action updateFromJson(json: SinglePsiModel) {
    this.psiRowsStore = observable.array(
      json.psiRowModles.map((model) => new PsiRowStore(this, model))
    );
    this.psiId = json.id;
  }

  toJSON(): SinglePsiModel {
    return {
      id: this.psiId,
      psiRowModles: this.psiRowsStore?.map(store => store.toJSON())
    }
  }

  @computed get modelData(): SinglePsiModel{
    const json=  {
      id: this.psiId,
      psiRowModles: this.psiRowsStore?.map(store => store.modelData)
    }
    console.log('single psi store' , json)
    return json;
    // return JSON.stringify(json);
  }

  onCellChanged() {
    // this.psiInstanceStore.onPsiChanged();
  }
}
