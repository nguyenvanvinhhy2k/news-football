import useMounted from 'hooks/useMounted';
import React, { createContext, useContext, useEffect, useMemo, useState, } from 'react'
import { EDITOR_MODE } from 'screens/CourseWare/constant';
import { useContexts as useWrapperContexts } from '../../context'

export const Context = createContext();
export const useContexts = () => useContext(Context);
export const Provider = ({ isQuestion = false, setContentParent, setMediaParent, children }) => {
    const { resetPreview, setEditorQuestionMode, setMedias, setContents } = useWrapperContexts();
    const [equationReady, setEquationReady] = useState(false)
    const [showEquation, setShowEquation] = useState(false)
    const [mathML, setEditorMathML] = useState('')
    const [editorMode, setEditorMode] = useState(EDITOR_MODE.NORMAL); //
    const [contentML, setContentML] = useState('');
    const [contentNormal, setContentNormal] = useState('');
    const [mediaML, setMediaML] = useState([]); // media cho bo go math
    const [mediaNormal, setMediaNormal] = useState([]); //media cho bo go thuong
    const { isMounted } = useMounted()

    useEffect(() => {
        const files = editorMode === EDITOR_MODE.NORMAL ? mediaNormal : mediaML
        if (!setMediaParent)
            setMedias({ isQuestion, files, mode: editorMode })
        else
            setMediaParent({ isQuestion, files, mode: editorMode })
    }, [editorMode, resetPreview, mediaNormal, mediaML, isQuestion])

    useEffect(() => {
        return
        if (!isMounted) return
        console.log('contentML, isMounted, contentNormal, editorMode', contentML, isMounted, contentNormal, editorMode)
        //    if (resetPreview === 0) return
        const content = (editorMode == EDITOR_MODE.NORMAL) ? contentNormal : contentML
        if (!setContentParent)
            setContents({ isQuestion, content, mode: editorMode })
        else
            setContentParent({ isQuestion, content, mode: editorMode })
        console.log(`setContentParent`, editorMode, contentNormal, contentML)
    }, [contentML, isMounted, contentNormal, editorMode])

    const setMediaEquation = (files) => {
        // setMedias({ isQuestion, files })
        if (editorMode === EDITOR_MODE.EQUATION) {
            setMediaML(files)
        } else {
            setMediaNormal(files)
        }

    }

    const toggleEquation = () => {
        if (!equationReady) return;
        setShowEquation(x => !x);
    }

    const setContent = (content) => {
        if (!isMounted) return
        console.log('setContentParent1', content)
        if (editorMode === EDITOR_MODE.NORMAL) {
            setContentNormal(content)
            if (!setContentParent)
                setContents({ isQuestion, content, mode: editorMode })
            else
                setContentParent({ isQuestion, content, mode: editorMode })
        } else
            setContentML(content)

    }


    const value = useMemo(() => ({
        equationReady, setEquationReady, toggleEquation,
        showEquation, setShowEquation,
        mathML, setEditorMathML,
        editorMode, setEditorMode,
        setContent, setMediaEquation,
        mediaNormal, setMediaNormal
    }), [
        equationReady,
        showEquation,
        mathML,
        editorMode,
        mediaNormal,
        setContent
    ])

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}
