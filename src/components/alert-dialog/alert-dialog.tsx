import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface AlertDialogProps {
  shouldOpen: boolean;
  title?: string;
  content: string;
  agreeText?: string;
  disagreeText?: string;
  onDialogClose: (isAgree: boolean) => void;
}
export default function AlertDialog(props: AlertDialogProps) {
  const { shouldOpen, title, content, agreeText, disagreeText, onDialogClose } = props;
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(shouldOpen), [shouldOpen]);
  console.log("reached")
  const handleClose = () => {
    setOpen(false);
  };

  const onAgree = () => {
    handleClose()
    onDialogClose(true)
  }

  const onDisagree = () => {
    handleClose()
    onDialogClose(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title ?? "Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDisagree}>{disagreeText ?? "Cancel"}</Button>
          <Button onClick={onAgree} autoFocus>
            {agreeText ?? "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
