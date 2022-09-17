import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
} from "mobx";
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
  @observable columnsText!: IObservableArray<string>;
  @observable psiName: string;

  constructor(
    readonly psiInstanceStore: PsiInstanceStore,
    SinglePsiModel?: SinglePsiModel
  ) {
    makeObservable(this);
    this.columnsText = observable.array(
      SinglePsiModel?.psiData.columnsText ?? ["Why / What", "Who", "How"]
    );
    this.psiId = SinglePsiModel?.psiData.id ?? uuid();
    this.psiName =
      SinglePsiModel?.psiData.psiName ?? "Enter title for this PSI";
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
    this.columnsText =
      json.psiData.columnsText != null
        ? observable.array(json.psiData.columnsText)
        : this.columnsText;
    this.psiName =
      json.psiData.psiName != null ? json.psiData.psiName : this.psiName;
  }

  @computed get modelData(): SinglePsiModel {
    const json = {
      psiData: {
        id: this.psiId,
        psiRowModels: this.psiRowsStore?.map((store) => store.modelData),
        columnsText: [...this.columnsText],
        psiName: this.psiName,
      },
    };
    return json;
  }

  @action setColumnText(index: number, data: string) {
    this.columnsText[index] = data;
  }

  @action setPsiName(psiName: string) {
    this.psiName = psiName;
  }

  @computed get whatWhyColumnText(): string {
    return this.columnsText[0];
  }

  @computed get whoColumnText(): string {
    return this.columnsText[1];
  }
  @computed get howColumnText(): string {
    return this.columnsText[2];
  }
}
