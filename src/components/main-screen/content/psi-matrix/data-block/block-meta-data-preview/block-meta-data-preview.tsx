import React from "react";
import "draft-js/dist/Draft.css";
import { observer } from "mobx-react";
import "./block-meta-data-preview.scss";
import PsiDataBlockStore from "../../../../../../stores/psi-data-block-store";
import moment from "moment";

interface PsiMatrixCellProps {
  store: PsiDataBlockStore;
}

function BlockMetaDataPreview(props: PsiMatrixCellProps) {
  const { store } = props;

  const formmatedTime = (timestamp: number): string => {
    return moment.unix(timestamp / 1000).format("DD/MM/YYYY-hh:mm:ss");
  };

  return (
    <div className="meta-data-container">
      <div className="created-by-container">
        <div className="header">
          <div>Created by:</div>
          <div>Created At:</div>
        </div>
        <div className="meta-data-block">
          <div>{store.creationData.user}</div>
          <div>{formmatedTime(store.creationData.timestamp)}</div>
        </div>
      </div>
      {store.editingHistory.length > 0 && (
        <div className="edited-by-container">
          <div className="header">
            <div>Edited by:</div>
            <div>Edited At:</div>
          </div>
          {store.editingHistory.map((edit, index) => (
            <div className="meta-data-block" key={edit.timestamp + "-" + index}>
              <div>{edit.user}</div>
              <div>{formmatedTime(edit.timestamp)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default observer(BlockMetaDataPreview);
