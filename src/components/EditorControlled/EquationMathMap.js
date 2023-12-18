import React, { memo, useEffect, useState, } from 'react'
import { Maximize, Minus, X } from 'react-feather'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, } from 'reactstrap'
import { useContexts } from './context'
import styles from './EquationEditor.module.css'

const EquationMathMap = ({ equationId, hiddenEquation }) => {
    let timer;
    const [editor, setEditor] = useState(null);
    const { showEquation, setEquationReady, setShowEquation, setEditorMathML } = useContexts();
    const [isMini, setIsMini] = useState(null)
    useEffect(() => {
        const element = document.getElementById(equationId);
        if (!document.getElementById(equationId)) return;
        const editor = window.com.wiris.jsEditor.JsEditor.newInstance({ 'language': 'en' });
        editor.insertInto(document.getElementById(equationId));
        window.editor = editor
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

    const getMathML = () => {
        if (editor) {
            const mathML = editor.getMathML();
            setEditorMathML(mathML)
        }
    }

    let opacity = (showEquation) ? 1 : 0
    let bottom = !showEquation ? '-1000px' : '50px'

    return (
        <>
            <div style={{ position: 'fixed', bottom: bottom, right: '0px', zIndex: 111, opacity: isMini === null ? 1 : (isMini ? 0 : 1) }}>
                <Card className={styles.wrapper} style={{ opacity: opacity, }}>
                    <CardHeader className="justify-content-end">
                        <div>
                            <Minus onClick={() => setIsMini(true)} />
                            <X onClick={() => setShowEquation(false)} />
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
                        <Button.Ripple color="primary" onClick={getMathML}>
                            Chèn công thức
                        </Button.Ripple>
                    </CardFooter>
                </Card>
            </div>
            {showEquation && <Card className={styles.wrapperMini} style={{ opacity: isMini === null ? 0 : (isMini ? 1 : 0) }}>
                <CardHeader>
                    <div>
                        <h3> Math Type</h3>
                    </div>
                    <div>
                        <Maximize onClick={() => setIsMini(false)} />
                        <X onClick={() => { setShowEquation(false); }} />
                    </div>
                </CardHeader>
            </Card>}
        </>
    )
}

export default memo(EquationMathMap)