import {RowData} from "./row-data";

export default interface PsiRowModel {
  rowNum: string;
  phase: string;
  data?: RowData;
}
