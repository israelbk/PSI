import {action, computed, IObservableArray, observable} from "mobx";
import LocalStorageService from "../services/local-storage-service";
import SinglePsiStore from "./single-psi-store";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiInstanceModel from "../models/psi-instance-model";

export default class PsiInstanceStore
  implements JsonSerializable<PsiInstanceModel>
{
  @observable psisStore!: IObservableArray<SinglePsiStore>;
  @observable currentPsiIndex;

  constructor() {
    this.currentPsiIndex = 0;
    this.initData();
  }

  @action updateFromJson(json: PsiInstanceModel) {
    const psiStores = json.psiModels.map((model) =>  new SinglePsiStore(this, model))
    this.psisStore = observable.array(psiStores);
  }

  @action initData(data?: string) {
    const localStorageData = data ?? LocalStorageService.getPsi();
    if (localStorageData != null) {
      this.updateFromJson(JSON.parse(localStorageData));
    } else {
      this.psisStore = observable.array([ new SinglePsiStore(this)]);
    }
  }

  @computed get currentPsiStore(): SinglePsiStore{
    return this.psisStore![this.currentPsiIndex];
  }

  getPsiData(){
    return JSON.stringify(this.toJSON())
  }

  onPsiChanged() {
    const psiData = this.getPsiData()
    LocalStorageService.setPsi(psiData)
  }

  toJSON(): PsiInstanceModel {
    return {
      psiModels: this.psisStore.map(store => store.toJSON())
    }
  }
}
