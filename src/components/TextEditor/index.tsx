import EditorType from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Controller } from 'react-hook-form';
import MyCustomUploadAdapterPlugin from '@/components/EditorControlled/MyCustomUploadAdapterPlugin';

import './ckEditor.css';

export default function TextEditor({
  className,
  type = "classic",
  name,
  control,
  error,
  rows = 5,
  key,
  setValue,
  initContent,
  register,
  editorRef,
}: any) {
  const itemsClassic = [
    'heading',
    '|',
    'sourceEditing',
    'bold',
    'italic',
    'underline',
    '|',
    'FontBackgroundColor',
    'FontColor',
    '|',
    'alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify',
    '|',
    'MathType',
    'ChemType',
    '|',
    // 'outdent',
    // 'indent',
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
    'insertTable',
    // 'blockQuote',
    // 'table',
    // 'specialCharacters',
    // '|',
    // 'fontsize',
    // 'fontfamily',
    // 'fontcolor',
    // 'alignment',
    'superscript',
    'subscript',
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

  const handleMaximize = (evt: any) => {
    const className: any = document.getElementsByClassName('wrs_modal_maximize_button')
    for (let ele of className)
      ele && ele.click()
  }

  return (
    <div className={`custom-ckeditor  ${className}`}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, name, ref } }) => (
          <CKEditor
            config={{
              placeholder: "Nhập nội dung câu hỏi",
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
            editor={EditorType}
            ref={editorRef}
            onChange={(e: any, editor: any) => {
              const value = editor.getData();
              setValue(name, value);
              onChange({ target: { value, name } })
            }}
            data={initContent}
            // onBlur={(event: any, editor: any) => {
            //   type == "inline" && setShowTool(false);
            // }}
            // onFocus={(event: any, editor: any) => {
            //   type == "inline" && setShowTool(true)
            // }}

            onReady={(editor: any) => {
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
        )}
      />
      <div className="text-sm text-red-700 mt-1 ml-1">
        {error?.message}
      </div>
    </div>
  )
}
