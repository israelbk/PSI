import ReactDom from "react-dom";
import React, {createContext} from "react";
import AlertDialog, {
  AlertDialogProps,
} from "../components/alert-dialog/alert-dialog";

const DialogService = {
  openDialog: (dialogProps: AlertDialogProps): void => {
    ReactDom.createPortal(
      <>
        <AlertDialog {...dialogProps} />
      </>,
      document.getElementById("portal")!
    );
  },
};

export default DialogService;
