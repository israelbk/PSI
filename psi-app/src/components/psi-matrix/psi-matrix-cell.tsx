import React, {useCallback, useState} from 'react';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {debounce} from "@mui/material";

interface PsiMatrixCellProps{
    initialState?: EditorState
}

export default function PsiMatrixCell(props: PsiMatrixCellProps){
    const {initialState} = props
    const [state,setState] = useState<EditorState>(initialState?? EditorState.createEmpty())


    const debounced = useCallback(debounce(() => {
        console.log(state.toJS());
    }, 1000), []);

    const onEditorStateChange = (state: EditorState) => {
        setState(state);
        debounced()
    };

    return (
        <div style={{ width: "500px" }}>
            <Editor
                editorState={state}
                onChange={onEditorStateChange}
            />
        </div>
    );
}