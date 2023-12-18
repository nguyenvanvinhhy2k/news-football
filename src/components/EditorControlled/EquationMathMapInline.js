import React, { memo, useEffect, useRef, useState, } from 'react'
import { Maximize, Minus, X } from 'react-feather'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, } from 'reactstrap'
import DropZone from '../DropZone'
import { useContexts } from './context'
import { useContexts as useWrapperContext } from '../../context'
import styles from './EquationEditor.module.css'
import { EDITOR_MODE } from 'screens/CourseWare/constant'
import useEditorReady from 'screens/CourseWare/hooks/useEditorReady'
import Loading from './Loading'

const EquationMathMapInline = ({ equationId, toggleEquation, display = 'none', isQuestion = false, defaultValue }) => {
    let timer;

    const { setQuestionContent, tabActive, resetPreview } = useWrapperContext();
    const { showEquation, setEquationReady, setShowEquation, setEditorMathML, setEditorMode, setContent, editorMode } = useContexts();
    const [isMini, setIsMini] = useState(null)
    const [editor, setEditor] = useState(null);
    const isLoaded = useEditorReady(display);

    useEffect(() => {
        const element = document.getElementById(equationId);
        if (!document.getElementById(equationId)) return;
        const editor = window.com.wiris.jsEditor.JsEditor.newInstance({ 'language': 'en' });
        editor.insertInto(document.getElementById(equationId));

        editor.onIsReady(() => {
            timer = setTimeout(() => {
                setEquationReady(true)
            }, 5000)
        })
        setEditor(editor)
        return () => timer && clearTimeout(timer)
    }, [equationId])

    useEffect(() => [
        showEquation && setIsMini(null)
    ], [showEquation])

    useEffect(() => {
        if (editor && defaultValue) {
            const value = defaultValue.replaceAll(/!!!\[equation\]\((.*?)\)!!!/g, "$1")
            editor.setMathML(value)
            setContent(value)
        }
    }, [editor, defaultValue])

    useEffect(() => {
        if (editor && tabActive === 3 && editorMode === EDITOR_MODE.EQUATION) {
            const mathML = editor.getMathML();
            setContent(mathML)
            window.mathML = mathML;
        }
    }, [tabActive, resetPreview, editorMode])

    const getMathML = () => {
        if (editor) {
            const mathML = editor.getMathML();
            setEditorMathML(mathML)
        }
    }

    const onClose = () => {
        setEditorMode(EDITOR_MODE.NORMAL);
        toggleEquation && toggleEquation()
    }

    let opacity = isLoaded ? 1 : 0
    let bottom = !showEquation ? '-1000px' : '50px'

    return (
        <>
            {(opacity === 0 && display === 'block') && <Loading />}
            <div style={{ display }}>
                <Card className={styles.wrapper} style={{ opacity: opacity, }}>
                    <CardHeader className="justify-content-end">
                        <div>
                            <X onClick={onClose} />
                        </div>
                    </CardHeader>
                    <CardBody className={styles.bodyCard}>
                        <Row>
                            <Col sm="12">
                                <Card style={{ marginBottom: 0 }}>
                                    <CardBody className="pt-2">
                                        <div id={equationId} style={{ minHeight: '400px' }} />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <div>

                        </div>
                    </CardBody>
                    <CardFooter>
                        <DropZone display={display} isQuestion={isQuestion} />
                    </CardFooter>
                </Card>
            </div>
            {/*  {showEquation && <Card className={styles.wrapperMini} style={{ opacity: isMini === null ? 0 : (isMini ? 1 : 0) }}>
                <CardHeader>
                    <div>
                        <h3> Math Type</h3>
                    </div>
                    <div>
                        <Maximize onClick={() => setIsMini(false)} />
                        <X onClick={() => { setShowEquation(false); }} />
                    </div>
                </CardHeader>
            </Card>} */}
        </>
    )
}

export default memo(EquationMathMapInline)
