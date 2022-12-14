import React, { useEffect } from "react";
import "./header.scss";
import PsiInstanceStore from "../../../stores/psi-instance-store";
import { LoadingButton } from "@mui/lab";
import { FileDownload, FileUpload } from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import { Button } from "@mui/material";
import LocalStorageService from "../../../services/local-storage-service";
import InlineTextField from "../../inline-render-text-number-field/inline-render-text-number-field";
import { observer } from "mobx-react";
import PsiEditor from "./psi-editor/psi-editor";

interface HeaderProps {
  store: PsiInstanceStore;
}
function Header(props: HeaderProps) {
  const { store } = props;

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: ".json",
  });

  useEffect(() => {
    if (filesContent.length === 0) return;
    try {
      const psiData = filesContent[0].content;
      store.loadData(psiData);
      LocalStorageService.setPsi(psiData);
    } catch (err) {
      alert("Sorry but the imported file format is not as expected");
      LocalStorageService.removePsi();
      store.initData();
      return;
    }
  }, [filesContent, store]);

  function onImportClicked() {
    openFileSelector();
  }

  function onExportClicked() {
    store.exportProjectJson();
  }

  return (
    <div className="app-header">
      <div className="left-side-main-header">
        <div className="brand">
          <a href="https://english.tau.ac.il/" target="blank" rel="noreferrer">
            <img
              src="https://finance.tau.ac.il/sites/finance.tau.ac.il/files/media_server/graphic-design/TAU%20NEW%20LOGO/ENG_bold.jpg"
              alt="LOGO"
            />
          </a>

          <a
            href="https://en-engineering.tau.ac.il/Engineering-Faculty-Systems-Engineering-M.Sc"
            target="blank"
            rel="noreferrer"
          >
            <img
              className="faculty"
              src="https://finance.tau.ac.il/sites/finance.tau.ac.il/files/media_server/graphic-design/TAU%20NEW%20LOGO/TAUAcademicUnitsLogos_10.jpg"
              alt="LOGO"
            />
          </a>
        </div>
      </div>
      <div className="app-name">
          <InlineTextField
              onBlur={(value) => store.setAppName(value)}
              input={store.appName}
              className={'psi-app-name-bold-big-text'}
              tooltipContent="This is where you add your project name"
          />
      </div>
      <div className="right-side-main-header">
        <PsiEditor store={store}/>
        <Button
          variant="contained"
          className="export-project"
          startIcon={<FileUpload />}
          onClick={onExportClicked}
        >
          Export
        </Button>
        <LoadingButton
          variant="contained"
          className="import-project"
          endIcon={<FileDownload />}
          onClick={onImportClicked}
          loading={loading}
        >
          Import
        </LoadingButton>
      </div>
    </div>
  );
}

export default observer(Header);
