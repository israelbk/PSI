import {action, computed, IObservableArray, makeObservable, observable} from "mobx";
import JsonSerializable from "../interfaces/JsonSerializable";
import SinglePsiModel from "../models/single-psi-model";
import PsiInstanceStore from "./psi-instance-store";
import { v4 as uuid } from "uuid";
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
    makeObservable(this);
    this.psiId = SinglePsiModel?.psiData.id ?? uuid();
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
      json.psiData.psiRowModels.map((model) => new PsiRowStore(this, model))
    );
    this.psiId = json.psiData.id;
  }

  toJSON(): SinglePsiModel {
    return {
      psiData: {
        id: this.psiId,
        psiRowModels: this.psiRowsStore?.map((store) => store.modelData),
      },
    };
  }

  @computed get modelData(): SinglePsiModel {
    const json = {
      psiData: {
        id: this.psiId,
        psiRowModels: this.psiRowsStore?.map((store) => store.modelData),
      },
    };
    return json;
    // return JSON.stringify(json);
  }

  onCellChanged() {
    // this.psiInstanceStore.onPsiChanged();
  }
}
