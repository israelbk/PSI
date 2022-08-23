import React, {useEffect} from "react";
import "./header.scss";
import PsiInstanceStore from "../../../stores/psi-instance-store";
import { LoadingButton } from '@mui/lab';
import { FileDownload, FileUpload } from "@mui/icons-material";
import moment from "moment";
import {useFilePicker} from "use-file-picker";
import {Button} from "@mui/material";

interface HeaderProps {
  store: PsiInstanceStore;
}
function Header(props: HeaderProps) {
  const { store } = props;

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: '.json',
  });

  useEffect(() => console.log(filesContent),[filesContent])

  function onImportClicked() {
    openFileSelector();
  }

  function onExportClicked() {
    const data = `data:text/json;chatset=utf-8,${encodeURIComponent(store.getPsiData())}`;
    const link = document.createElement("a");
    const currentDate = moment().format("YYYY/MM/DD-HH:MM");
    link.href = data;
    link.download = `PSI-${currentDate}.json`;
    link.click();
  }

  return (
    <div className="app-header">
      <div className="left-side-main-header">
        <div className="brand">
          <img
            src="https://finance.tau.ac.il/sites/finance.tau.ac.il/files/media_server/graphic-design/TAU%20NEW%20LOGO/ENG_bold.jpg"
            alt="LOGO"
          />
          <img
            className="faculty"
            src="https://finance.tau.ac.il/sites/finance.tau.ac.il/files/media_server/graphic-design/TAU%20NEW%20LOGO/TAUAcademicUnitsLogos_10.jpg"
            alt="LOGO"
          />
        </div>
      </div>
      <div className="header-center">Welcome to PSI app</div>
      <span>Gai is the king!</span>

      <div className="right-side-main-header">
        <div className="editor-profile-container"></div>
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

export default Header;
