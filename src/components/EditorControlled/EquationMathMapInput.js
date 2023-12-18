import React, { memo, useEffect, useState, } from 'react'
import { Card, CardBody, CardFooter, Col, Row, Button } from 'reactstrap'
import styles from './EquationEditor.module.css'
import { useContexts as useWrapperContexts } from '../../context'
import useEditorReady from 'screens/CourseWare/hooks/useEditorReady'
import Loading from './Loading'

const EquationMathMapInput = ({ equationId, display = 'none', onUpdateContent, defaultValue }) => {
    let timer;
    const { tabActive, resetPreview } = useWrapperContexts()
    const [editor, setEditor] = useState(null);
    const isLoaded = useEditorReady(display);
    useEffect(() => {
        const element = document.getElementById(equationId);
        if (!element) return;
        const editor = window.com.wiris.jsEditor.JsEditor.newInstance({ 'language': 'fr' });
        editor.insertInto(element);
        window.editor = editor
        setEditor(editor)
        return () => timer && clearTimeout(timer)
    }, [equationId])


    useEffect(() => {
        if (editor && defaultValue) {
            const value = defaultValue.replaceAll(/!!!\[equation\]\((.*?)\)!!!/g, "$1")
            editor.setMathML(value)
            onUpdateContent && onUpdateContent(value)
        }
    }, [editor, defaultValue])

    useEffect(() => {
        if (tabActive === 3 && display === 'block')
            onConfirm()
    }, [tabActive, resetPreview, display])

    const onConfirm = () => {
        if (editor) {
            const mathML = editor.getMathML();
            onUpdateContent && onUpdateContent(mathML)
        }
    }
    let opacity = isLoaded ? 1 : 0
    return (
        <>
            {(opacity === 0 && display === 'block') && <Loading />}
            <div style={{ display }}>
                <Card className={styles.wrapper} style={{ opacity: opacity, maxWidth: '100%' }}>
                    <CardBody className={styles.bodyCard}>
                        <Row>
                            <Col sm="12">
                                <Card style={{ marginBottom: 0 }}>
                                    <CardBody className="pt-2">
                                        <div id={equationId} />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <div>

                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button.Ripple color="primary" onClick={onConfirm}>
                            <span className="align-middle ml-25">Xác nhận</span>
                        </Button.Ripple>
                    </CardFooter>
                </Card>
            </div>

        </>
    )
}

export default memo(EquationMathMapInput)