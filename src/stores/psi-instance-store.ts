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
import PsiInstanceModel from "../interfaces/psi-instance-model";
import { v4 as uuid } from "uuid";
import moment from "moment";
import PsiDataBlockStore from "./psi-data-block-store";

export default class PsiInstanceStore
  implements JsonSerializable<PsiInstanceModel>
{
  @observable psisStore!: IObservableArray<SinglePsiStore>;
  @observable currentPsiIndex!: number;
  @observable appName!: string;
  @observable currentEditor!: string;
  @observable dataBlockClipboard?: PsiDataBlockStore;
  @observable isAdmin?: boolean;
  @observable isInAdminMode?: boolean;
  @observable isCompactView?: boolean;

  constructor() {
    makeObservable(this);
    try {
      this.initData();
    } catch (e) {
      alert(
        "Oops, your saved data could not be used to initialize the PSI app \r\n " +
          "A download of your saved data will start now \r\n" +
          "You won't be able to import the downloaded file,\r\n" +
          "but you can try open it and take important data from it into your new project \r\n" +
          "Meanwhile, here's a new clear working project:"
      );
      const corruptedJson = LocalStorageService.getPsi();
      LocalStorageService.removePsi();
      this.initData();
      this.exportProjectJson(corruptedJson);
    }
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

  @action cloneCurrentPsi() {
    const psiModelData = this.currentPsiStore.modelData;
    psiModelData.psiData.id = uuid();
    psiModelData.psiData.psiName += " (cloned)";
    this.psisStore.push(new SinglePsiStore(this, psiModelData));
    this.currentPsiIndex = this.psisStore.length - 1;
  }

  @action addNewPsi(newPsi: SinglePsiStore) {
    this.psisStore.push(newPsi);
    this.currentPsiIndex = this.psisStore.length - 1;
  }

  @action setStateClipboard(dataBlock?: PsiDataBlockStore) {
    this.dataBlockClipboard = dataBlock;
  }

  @action toggleAdminViewMode() {
    this.isInAdminMode = !this.isInAdminMode;
  }

  @action toggleCompactView() {
    this.isCompactView = !this.isCompactView;
  }

  @action deleteCurrentPsi() {
    if (this.psisStore.length === 1) return;
    this.psisStore.splice(this.currentPsiIndex, 1);
    if (this.currentPsiIndex === this.psisStore.length) {
      this.currentPsiIndex--;
    }
  }

  @action setAppName(newName: string) {
    this.appName = newName;
  }

  @action setCurrentEditor(newEditor: string) {
    if(newEditor.trim().toLowerCase() === "admin")
      this.isAdmin = true;
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
    this.isAdmin = json.admin ?? false;
    this.isInAdminMode = json.inAdminMode ?? false;
    this.isCompactView = json.isCompactView ?? false;
  }

  @action initData() {
    this.currentPsiIndex = 0;
    this.appName = "Welcome to PSI app";
    this.currentEditor = "Enter your name";
    this.dataBlockClipboard = undefined;
    const localStorageData = LocalStorageService.getPsi();
    if (localStorageData != null) {
      this.updateFromJson(JSON.parse(localStorageData));
    } else {
      this.psisStore = observable.array([new SinglePsiStore(this)]);
    }
  }

  @action loadData(data: string) {
    if (data == null) {
      throw new Error("Cannot load empty data");
    }
    this.updateFromJson(JSON.parse(data));
  }

  @computed get currentPsiStore(): SinglePsiStore {
    return this.psisStore![this.currentPsiIndex];
  }

  onPsiChanged = () => {
    LocalStorageService.setPsi(this.psiJson);
  };

  exportProjectJson(jsonToExport?: string | null) {
    if (jsonToExport == null) {
      delete this.modelData.currentEditor;
      this.modelData.admin = false;
      jsonToExport = JSON.stringify(this.modelData);
    }
    const data = `data:text/json;chatset=utf-8,${encodeURIComponent(
      jsonToExport
    )}`;

    const link = document.createElement("a");
    const currentDate = moment().format("YYYY/MM/DD-hh:mm");
    link.href = data;
    link.download = `PSI-Project-${currentDate}.json`;
    link.click();
  }

  @computed get modelData(): PsiInstanceModel {
    return {
      psiModels: this.psisStore.map((store) => store.modelData),
      appName: this.appName,
      currentEditor: this.currentEditor,
      currentPsiIndex: this.currentPsiIndex.toString(),
      admin: this.isAdmin ?? false,
      inAdminMode: this.isInAdminMode ?? false,
      isCompactView: this.isCompactView ?? false,
    };
  }

  @computed get psiJson(): string {
    return JSON.stringify(this.modelData);
  }
}
