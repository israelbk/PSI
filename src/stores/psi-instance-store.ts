import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
  reaction,
} from "mobx";
import LocalStorageService from "../services/local-storage-service";
import SinglePsiStore from "./single-psi-store";
import JsonSerializable from "../interfaces/JsonSerializable";
import PsiInstanceModel from "../models/psi-instance-model";

export default class PsiInstanceStore
  implements JsonSerializable<PsiInstanceModel>
{
  @observable psisStore!: IObservableArray<SinglePsiStore>;
  @observable currentPsiIndex: number;
  @observable appName: string;

  constructor() {
    makeObservable(this);
    this.currentPsiIndex = 0;
    this.appName = "Welcome to PSI app";
    // autorun( this.onPsiChanged );
    this.initData();
    reaction(
      () => this.psiJson,
      (psiJson) => LocalStorageService.setPsi(psiJson)
    );
  }

  @action setCurrentPsiIndex(newIndex: number) {
    this.currentPsiIndex = newIndex;
  }

  @action createNewPsi() {
    this.psisStore.push(new SinglePsiStore(this));
    this.currentPsiIndex = this.psisStore.length - 1;
  }

  @action addNewPsi(newPsi: SinglePsiStore) {
    this.psisStore.push(newPsi);
    this.currentPsiIndex = this.psisStore.length - 1;
  }

  @action DeleteCurrentPsi() {
    if (this.psisStore.length === 1) return;

    this.psisStore.splice(this.currentPsiIndex, 1);
  }

  @action setAppName(newName: string) {
    this.appName = newName;
    // this.onPsiChanged()
  }

  @action updateFromJson(json: PsiInstanceModel) {
    this.appName = json.appName;
    this.currentPsiIndex = parseInt(json.currentPsiIndex) || 0;
    const psiStores = json.psiModels.map(
      (model) => new SinglePsiStore(this, model)
    );
    this.psisStore = observable.array(psiStores);
  }

  @action initData(data?: string) {
    const localStorageData = data ?? LocalStorageService.getPsi();
    if (localStorageData != null) {
      this.updateFromJson(JSON.parse(localStorageData));
    } else {
      this.psisStore = observable.array([new SinglePsiStore(this)]);
    }
  }

  @computed get currentPsiStore(): SinglePsiStore {
    return this.psisStore![this.currentPsiIndex];
  }

  onPsiChanged = () => {
    LocalStorageService.setPsi(this.psiJson);
  };

  toJSON() {
    return {
      psiModels: this.psisStore.map((store) => store.toJSON()),
      appName: this.appName,
      currentPsiIndex: this.currentPsiIndex.toString(),
    };
  }

  @computed get modelData(): PsiInstanceModel {
    const json = {
      psiModels: this.psisStore.map((store) => store.modelData),
      appName: this.appName,
      currentPsiIndex: this.currentPsiIndex.toString(),
    };

    return json;
  }

  @computed get psiJson(): string {
    const json = this.modelData;
    return JSON.stringify(json);
  }
}
