import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PsiMatrixCell from "./psi-matrix-cell";
import PsiInstanceStore from "../../stores/psi-instance-store";
import PsiRowStore from "../../stores/psi-row-store";

interface PsiMatrixContainerProps{
    store: PsiInstanceStore;
}

export default function PsiMatrixContainer(props: PsiMatrixContainerProps) {
    const {store}  = props;
    const currentPsi = store.currentPsiStore;
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell align="right">Why / What</TableCell>
                        <TableCell align="right">Who</TableCell>
                        <TableCell align="right">How</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPsi.psiRowsStore.map((row: PsiRowStore) => (
                        <TableRow
                            key={row.rowNum.toString()+'-'+row.phase}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <bdi dir='auto'>{row.phase}</bdi>
                            </TableCell>
                            <TableCell align="right"><PsiMatrixCell store={row.what}/></TableCell>
                            <TableCell align="right"><PsiMatrixCell store={row.who}/></TableCell>
                            <TableCell align="right"><PsiMatrixCell store={row.how}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
