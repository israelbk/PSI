import PsiInstanceStore from "../../../../../stores/psi-instance-store";
import { Tooltip } from "../../../../tooltip/tooltip";
import { Button } from "@mui/material";
import { observer, Observer } from "mobx-react";
import { useEffect, useState } from "react";
import "./psi-actions.scss";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PsiActionOption from "./psi-action-option/psi-action-option";
import { useFilePicker } from "use-file-picker";
import SinglePsiModel from "../../../../../models/single-psi-model";
import SinglePsiStore from "../../../../../stores/single-psi-store";
import { FileDownload, FileUpload } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import moment from "moment";
import {v4 as uuid} from "uuid";

interface PsiActionsProps {
  store: PsiInstanceStore;
}
function PsiActions(props: PsiActionsProps) {
  const { store } = props;
  const [psiActionsIsOpen, setPsiActionsIsOpen] = useState(false);
  const disableDeletePsi = store.psisStore.length === 1;

  const [openFileSelector, { filesContent }] = useFilePicker({
    accept: ".json",
  });

  useEffect(() => {
    if (filesContent.length === 0) {
      return;
    }
    const psiData = filesContent[0].content;
    const jsonModel: SinglePsiModel = JSON.parse(psiData);
    try {
      const newPsi = new SinglePsiStore(store, jsonModel);
      store.addNewPsi(newPsi);
    } catch (err) {
      alert("Sorry but the imported file format is not as expected");
      return;
    }
  }, [filesContent, store]);

  function createNewPsi() {
    store.createNewPsi();
    setPsiActionsIsOpen(false);
  }

  function cloneCurrentPsi() {
    store.cloneCurrentPsi();
    setPsiActionsIsOpen(false);
  }

  function deleteCurrentPsi() {
    store.deleteCurrentPsi();
    setPsiActionsIsOpen(false);
  }

  function toggleAdminViewMode() {
    store.toggleAdminViewMode();
    setPsiActionsIsOpen(false);
  }

  function toggleCompactView() {
    store.toggleCompactView();
    setPsiActionsIsOpen(false);
  }

  function importNewPsi() {
    openFileSelector();
    setPsiActionsIsOpen(false);
  }

  function exportCurrentPsi() {
    const exportedPsi = store.currentPsiStore.modelData;
    exportedPsi.psiData.id = uuid();
    const data = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(exportedPsi)
    )}`;
    const link = document.createElement("a");
    const currentDate = moment().format("YYYY/MM/DD-hh:mm");
    link.href = data;
    link.download = `Single-PSI-${currentDate}.json`;
    link.click();
    setPsiActionsIsOpen(false);
  }

  function renderPsiActionsOptions() {
    return (
      <div className="psi-actions-drop-down-wrapper">
        <PsiActionOption
          text="Add a blank PSI"
          onClick={() => createNewPsi()}
          renderIcon={() => <AddIcon />}
        />
        <PsiActionOption
          text="Clone current PSI"
          onClick={() => cloneCurrentPsi()}
          renderIcon={() => <FileCopyIcon />}
        />
        <PsiActionOption
          text="Import new PSI"
          onClick={() => importNewPsi()}
          renderIcon={() => <FileDownload />}
        />
        <PsiActionOption
          text="Export current PSI"
          onClick={() => exportCurrentPsi()}
          renderIcon={() => <FileUpload />}
        />
        <PsiActionOption
          text="Delete current PSI"
          onClick={() => deleteCurrentPsi()}
          renderIcon={() => <DeleteIcon />}
          disabled={disableDeletePsi}
        />
        <PsiActionOption
          text={store.isInAdminMode ? "Exit admin view" : "Enter admin view"}
          onClick={() => toggleAdminViewMode()}
          renderIcon={() => <AdminPanelSettingsIcon />}
          disabled={!store.isAdmin}
        />
        <PsiActionOption
            text={store.isCompactView ? "Exit compact view" : "Enter compact view"}
            onClick={() => toggleCompactView()}
            renderIcon={() => <AddIcon />}
        />
      </div>
    );
  }

  return (
    <div className="psi-actions-wrapper">
      <Tooltip
        trigger="click"
        interactive
        content={renderPsiActionsOptions()}
        theme="light"
        placement="right-end"
        visible={psiActionsIsOpen}
        onClickOutside={() => setPsiActionsIsOpen(false)}
      >
        <Observer>
          {() => (
            <Button
              variant="outlined"
              className="psi-actions-button"
              onClick={() => setPsiActionsIsOpen((open) => !open)}
            >
              Actions
            </Button>
          )}
        </Observer>
      </Tooltip>
    </div>
  );
}

export default observer(PsiActions);
