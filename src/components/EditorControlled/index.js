import React, { memo, useRef, } from 'react'
import { Provider, useContexts } from './context'
import { useContexts as useWrapperContexts } from '../../context'
import EditorBase from './EditorBase'
import CustomCkeditor from './CustomCKEditor'

const EditorControlledImpl = ({ equationId, isQuestion = false, initContentValue }) => {
    console.log(`initContentValue`, initContentValue)
    const { showEquation, setShowEquation, setContent, } = useContexts()
    const editorRef = useRef(null);

    const hiddenEquation = () => showEquation && setShowEquation(false)
    const onTextChange = (text) => setContent(text)
    const { initData } = useWrapperContexts();

    return (
        <>
            <CustomCkeditor
                onTextChange={onTextChange}
                initContent={initContentValue}
                choices={initData?.choices || []}
            />
            {/* <EditorBase
                ref={editorRef}
                hiddenEquation={hiddenEquation}
                onTextChange={onTextChange}
                equationId={equationId}
                isQuestion={isQuestion}
                //initContent={!initData ? null : initData.content}
                initContent={initContentValue}
                choices={initData?.choices || []}
            /> */}
        </>
    )
}

const EditorControlled = (props) =>
    <Provider
        isQuestion={props.isQuestion} // isQuestion thể hiện editor này dùng cho content hay explain
        setContentParent={props.setContent}
        setMediaParent={props.setMedia}
    >
        <EditorControlledImpl {...props} />
    </Provider>

export default memo(EditorControlled)
