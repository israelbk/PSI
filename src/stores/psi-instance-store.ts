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
import DialogService from "../services/dialog-service";

export default class PsiInstanceStore
  implements JsonSerializable<PsiInstanceModel>
{
  @observable psisStore!: IObservableArray<SinglePsiStore>;
  @observable currentPsiIndex: number;
  @observable appName: string;
  @observable currentEditor: string;

  constructor() {
    makeObservable(this);
    this.currentPsiIndex = 0;
    this.appName = "Welcome to PSI app";
    this.currentEditor = "Enter your name";
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
    if (this.currentPsiIndex === this.psisStore.length){
      this.currentPsiIndex--;
    }
  }

  @action setAppName(newName: string) {
    this.appName = newName;
  }

  @action setCurrentEditor(newEditor: string) {
    this.currentEditor = newEditor;
  }

  @action updateFromJson(json: PsiInstanceModel) {
    this.appName = json.appName;
    this.currentEditor = json.currentEditor ?? this.currentEditor;
    this.currentPsiIndex = parseInt(json.currentPsiIndex) || 0;
    const psiStores = json.psiModels.map(
      (model) => new SinglePsiStore(this, model)
    );
    this.psisStore = observable.array(psiStores);
  }

  @action initData() {
    try {
      const localStorageData = LocalStorageService.getPsi();
      if (localStorageData != null) {
        this.updateFromJson(JSON.parse(localStorageData));
      } else {
        this.psisStore = observable.array([new SinglePsiStore(this)]);
      }
    } catch (e) {
      console.log("ERR")
      DialogService.openDialog({
        content: "aaa",
        onDialogClose(isAgree: boolean): void {},
        shouldOpen: true,
      });
    }
  }

  @action loadData(data: string) {
    if (data == null) {
      throw new Error('Cannot load empty data');
    }
    this.updateFromJson(JSON.parse(data));
  }


  @computed get currentPsiStore(): SinglePsiStore {
    return this.psisStore![this.currentPsiIndex];
  }

  onPsiChanged = () => {
    LocalStorageService.setPsi(this.psiJson);
  };

  @computed get modelData(): PsiInstanceModel {
    return {
      psiModels: this.psisStore.map((store) => store.modelData),
      appName: this.appName,
      currentEditor: this.currentEditor,
      currentPsiIndex: this.currentPsiIndex.toString(),
    };
  }

  @computed get psiJson(): string {
    const json = this.modelData;
    return JSON.stringify(json);
  }
}
