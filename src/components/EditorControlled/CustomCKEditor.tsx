import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import EditorType from 'ckeditor5-custom-build/build/ckeditor';
import './ckEditor.css';
import MyCustomUploadAdapterPlugin from './MyCustomUploadAdapterPlugin';
import { convertHtmlToMathml } from '../../utils/paragraphFormation';
// convert data to '/n'
const convertToText = (str:any) => {
    const splitStr = str?.split(/<p>(.*?)<\/p>/g);
    return splitStr?.filter((e:any) => e != "").join(`\n`) || ''
}
// convert '/n' to post data
const converToXml = (xml:any) => {
    return xml?.split('\n').map((e:any)=> `<p>${e}</p>`).join("") || ''
}
export default function EditorBase({ type = "classic", onChange, placeholder = "Gõ nội dung ở đây!", onTextChange, isAnswer = false, onChangeAnswer, initContent, indexContent, setContents, contents
    // showEquation, isFocus = false, showEquation = false, initContent = '', mathMLDefault = ''
}:any) {
    const [showTool, setShowTool] = useState(false)
    const [data, setdata] = useState('')
    const [isEditorReady, setIsEditorReady] = useState(false)
    const itemsClassic = [
        'heading',
        '|',
        'sourceEditing',
		    '|',
        'bold',
        'italic',
        'underline',
        '|',
        'MathType',
        'ChemType',
        '|',
        // 'outdent',
        // 'indent',
        // '|',
        // 'bulletedList',
        // 'numberedList',
        // 'strikethrough',
        // 'code',
        // 'subscript',
        // 'superscript',
        'link',
        // 'ngjyutumberedList',
        // 'imageUpload',
        'insertImage',
        'mediaEmbed',
        // 'insertTable',
        // 'blockQuote',
        // 'table',
        // 'specialCharacters',
        // '|',
        // 'fontsize',
        // 'fontfamily',
        // 'fontcolor',
        // 'alignment',
        '|',
        'undo',
        'redo',
        // 'ckfinder'
    ]
    const itemsInline = [
        'bold',
        'italic',
        'underline',
        '|',
        'MathType',
        'ChemType',
    ]

    useEffect(() => {
        //setInterval(()=>{setdata(Math.random().toString())},1000)
    }, [])

    useEffect(() => {
        if (initContent && isEditorReady) {
            setdata(convertHtmlToMathml(initContent))
        }
    }, [initContent, isEditorReady])

    const handleMaximize = (evt:any) => {
        const className:any = document.getElementsByClassName('wrs_modal_maximize_button')
        for (let ele of className)
            ele && ele.click()
    }

    return (
        <div className={((type == "inline" && !showTool) ? 'hidden-toolbar' : '') + ` ${type}` + " compose-editor"}>
            <CKEditor
                editor={EditorType}
                config={{
                    placeholder: placeholder,
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    toolbar: {
                        items: type !== "inline" ? itemsClassic : itemsInline,
                    },
                    htmlSupport: {
                      allow: [
                        {
                          name: /.*/,
                          attributes: true,
                          classes: true,
                          styles: true
                        }
                      ]
                    }
                }}
                // onReady={editor => setIsEditorReady(true)}
                onChange={(e: any, editor: any) => {
                  const value = editor.getData();
                  const isError = value.length > 0 ? false : true;

                  const newData =  contents.map((val: any, index: number)=>{
                    return index==indexContent ? {value, error: isError} : {...val}
                  })
                  setContents(newData)
                }}
                data={initContent}
                onBlur={(event:any, editor:any) => {
                    type == "inline" && setShowTool(false);
                }}
                onFocus={(event:any, editor:any) => {
                    type == "inline" && setShowTool(true)
                }}

                onReady={(editor:any) => {
                    setIsEditorReady(true)
                    if (editor) {
                        const commandMath = editor.commands.get('MathType')
                        const commandChem = editor.commands.get('ChemType')

                        commandMath.on('execute', () => {
                            handleMaximize(editor)
                        })
                        commandChem.on('execute', () => {
                            handleMaximize(editor)
                        })
                    }
                }}

            />

            {/* <div style={{ display: !showEquation ? 'block' : 'none' }}>
                <DropZone
                    inputContent='Tải lên file Audio/Video'
                    accept='audio/*,video/*'
                    display={!showEquation ? 'block' : 'none'}
                    // {...props}

                    isFocus={isFocus}
                    showEquation={showEquation}
                    initContent={initContent}
                    mathMLDefault={mathMLDefault}
                />
            </div> */}
        </div>
    )
}
