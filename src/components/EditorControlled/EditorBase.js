import React from "react"
import { Card, CardBody, } from "reactstrap"
import { EditorState, Modifier, convertToRaw, ContentState, AtomicBlockUtils } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "assets/scss/plugins/extensions/editor.scss"
import icon from "assets/img/crm/keys 1.png"
import { useContexts } from "./context";
import htmlToDraft from 'html-to-draftjs'
import EquationMathMapInline from "./EquationMathMapInline";
import { EDITOR_MODE, QUESTION_TYPE } from "screens/CourseWare/constant";
import DropZone from "../DropZone";
// import { updateLoadMediaByCourse } from "services/mediaService";
import { contentHasMathML } from "helpers/paragraphFormation";
import { useContexts as useWrapperContexts } from '../../context'
import { updateLoadMediaByCourse } from "@/services/media.service";
class EditorBase extends React.Component {
    state = {
        editorState: EditorState.createEmpty(),
        isFocus: false,
        showEquation: false,
        initContent: '',
        mathMLDefault: ''
    }

    componentDidMount() {
        const { initContent } = this.props;
        if (initContent)
            this.sendHtmlToEditor(initContent)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.initContent && nextProps.initContent !== this.props.initContent) {
            let content = ''
            if (this.props.isQuestion) {
                content = nextProps.initContent;
            } else {
                content = nextProps.choices.find(x => x.is_right === true)?.comment
            }
            if (content) {
                const showEquation = contentHasMathML(content)
                if (!showEquation) {
                    this.sendHtmlToEditor(content)
                    this.props.onTextChange && this.props.onTextChange(content);
                } else
                    this.setState({ showEquation: true, mathMLDefault: content })
            }
        }
    }
    // static getDerivedStateFromProps(props, state) {
    //     if (props.initContent && props.initContent !== state.initContent) {
    //         this.sendHtmlToEditor(props.initContent)
    //         return {
    //             initContent: props.initContent
    //         }
    //     }
    //     else return null
    // }

    onEditorStateChange = editorState => {
        this.setState({
            editorState
        })
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        this.props.onTextChange && this.props.onTextChange(html);
    }
    sendTextToEditor = (text) => {
        const that = this;
        that.setState({
            editorState: that.insertText(text, that.state.editorState)
        }, () => {
            that.focusEditor();
        })
    }
    sendHtmlToEditor = (html) => {
        const that = this;
        that.setState({
            editorState: that.insertHtml(html, that.state.editorState)
        }, () => {
            that.focusEditor();
        })
    }

    insertHtml = (html, editorState) => {
        const { contentBlocks, entityMap } = htmlToDraft(html);
        //const { editorState } = this.state;
        let newContent = Modifier.replaceWithFragment(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            ContentState.createFromBlockArray(contentBlocks, entityMap).getBlockMap()
        )
        const newEditorState = EditorState.push(editorState, newContent, 'insert-fragment');
        return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
    }

    insertText = (text, editorState) => {
        const currentContent = editorState.getCurrentContent(),
            currentSelection = editorState.getSelection();

        const newContent = Modifier.replaceText(
            currentContent,
            currentSelection,
            text
        );

        const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
        return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
    }
    insertImage = (editorState, base64) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'IMAGE',
            'IMMUTABLE',
            { src: base64, },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentState },
        );
        return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    };
    focusEditor = () => {
        if (this.editor) {
            this.editor.focusEditor();
        }
    };

    getFileBase64 = async (file, callback) => {
        // var reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = () => callback(reader.result);
        // reader.onerror = error => { };

        const response = await updateLoadMediaByCourse({ file })
        const url = response?.data?.data?.[0]?.path;
        if (url) callback("https://minio.ftech.ai/fqa/" + url);
    };

    imageUploadCallback = file => new Promise(
        (resolve, reject) => this.getFileBase64(
            file,
            data => resolve({ data: { link: data } })
        )
    );

    toggleEquation = (show) => this.setState({ showEquation: show })

    render() {
        const { editorState, showEquation } = this.state
        const { equationId } = this.props;
        return (
            <Card>
                <CardBody>
                    <EquationMathMapInline
                        equationId={equationId}
                        toggleEquation={() => this.toggleEquation(false)}
                        display={showEquation ? 'block' : 'none'}
                        defaultValue={this.state.mathMLDefault}
                        {...this.props}
                    />
                    {!showEquation &&
                        < Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={this.onEditorStateChange}
                            toolbarCustomButtons={[<CustomOption {...this.props} toggleEquation={this.toggleEquation} />]}
                            toolbar={{
                                image: {
                                    uploadCallback: this.imageUploadCallback,
                                    previewImage: true,
                                    alignmentEnabled: true,
                                    className: 'editor-image'
                                },
                            }}
                            onFocus={() => { this.setState({ isFocus: true }); }}
                            onBlur={() => { this.setState({ isFocus: false }); }}
                        />
                    }
                    <div style={{ display: !showEquation ? 'block' : 'none' }}>
                        <DropZone
                            inputContent='Tải lên file Audio/Video'
                            accept='audio/*,video/*'
                            display={!showEquation ? 'block' : 'none'}
                            {...this.props}
                        />
                    </div>

                </CardBody>
            </Card>
        )
    }
}

const CustomOption = ({ toggleEquation }) => {
    const { setEditorMode, } = useContexts();
    const { questionType } = useWrapperContexts()
    if (questionType === QUESTION_TYPE.MULTI_QUESTIONS) return null
    return (
        <div onClick={() => { setEditorMode(EDITOR_MODE.EQUATION); toggleEquation(true) }} className={`rdw-embedded-wrapper`}>
            <div style={{ border: "none", cursor: "pointer" }}>
                <img src={icon} />
            </div>
        </div>
    )
}

export default EditorBase
