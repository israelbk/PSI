import {action, autorun, computed, IObservableArray, observable, reaction} from "mobx";
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
    this.currentPsiIndex = 0;
    this.appName = "Welcome to PSI app";
    // autorun( this.onPsiChanged );
    this.initData();
    reaction(
        () => this.psiJson,
        (psiJson) => LocalStorageService.setPsi(psiJson));
  }

  @action setCurrentPsiIndex(newIndex: number) {
    this.currentPsiIndex = newIndex;
    console.log('setCurrentPsiIndex', newIndex)
  }

  @action createNewPsi() {
    this.psisStore.push(new SinglePsiStore(this))
    this.currentPsiIndex = this.psisStore.length-1;
  }

  @action setAppName(newName: string) {
    this.appName = newName;
    // this.onPsiChanged()
  }

  @action updateFromJson(json: PsiInstanceModel) {
    this.appName = json.appName;
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
    console.log(this.psiJson);
    return this.psisStore![this.currentPsiIndex];
  }

  onPsiChanged = () => {
    console.log("onPsiChanged" , this.psiJson)
    LocalStorageService.setPsi(this.psiJson);
  }

  toJSON(){
    return {
      psiModels: this.psisStore.map((store) => store.toJSON()),
      appName: this.appName,
    };
  }

  @computed get modelData(): PsiInstanceModel {
    // return this.toJSON()
    const json = {
      psiModels: this.psisStore.map((store) => store.modelData),
      appName: this.appName,
    };

    return json
  }


  @computed get psiJson(): string {
    console.log('instance store', this.modelData)
    const json = this.modelData;
    return JSON.stringify(json);
  }
}
