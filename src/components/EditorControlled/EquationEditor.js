// import React, { memo, useEffect, useState } from 'react'
// import { Button, NavLink, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Nav, NavItem, Row, TabContent, TabPane } from 'reactstrap'
// import classnames from "classnames"
// import { addStyles, EditableMathField } from 'react-mathquill'

// import styles from './EquationEditor.module.css'
// import MapArrow from './MapArrow'
// import MapGreek from './MapGreek'
// import MapLogic from './MapLogic'
// import MapMath from './MapMath'
// import MapRel from './MapRel'
// import MapSymbol from './MapSymbol'

// addStyles()

// const tabs = [
//     { id: 1, text: 'Greek' },
//     { id: 2, text: 'Rel' },
//     { id: 3, text: 'Logic' },
//     { id: 4, text: 'Symbol' },
//     { id: 5, text: 'Arrow' },
//     { id: 6, text: 'Math' },
// ]

// const EquationEditor = () => {
//     const [activeTab, setActiveTab] = useState("1")
//     const [latex, setLatex] = useState('')

//     const renderTab = () => {
//         const ui = tabs.map(x => {
//             return (
//                 <NavItem key={x.id}>
//                     <NavLink onClick={() => setActiveTab(x.id.toString())} className={classnames({ active: activeTab == x.id })}>
//                         <span className="align-middle ml-50">{x.text}</span>
//                     </NavLink>
//                 </NavItem>
//             )
//         })
//         return ui;
//     }

//     const onChosen = (text) => setLatex(x => `${x}${text}`)

//     return (
//         <Card className={styles.wrapper}>
//             <CardBody className={styles.bodyCard}>
//                 <Row>
//                     <Col sm="12">
//                         <Card style={{ marginBottom: 0 }}>
//                             <CardBody className="pt-2">
//                                 <Nav tabs>
//                                     {renderTab()}
//                                 </Nav>
//                                 <TabContent activeTab={activeTab}>
//                                     <TabPane tabId="1">
//                                         <MapGreek onChosen={onChosen} />
//                                     </TabPane>
//                                     <TabPane tabId="2">
//                                         <MapRel onChosen={onChosen} />
//                                     </TabPane>
//                                     <TabPane tabId="3">
//                                         <MapLogic onChosen={onChosen} />
//                                     </TabPane>
//                                     <TabPane tabId="4">
//                                         <MapSymbol onChosen={onChosen} />
//                                     </TabPane>
//                                     <TabPane tabId="5">
//                                         <MapArrow onChosen={onChosen} />
//                                     </TabPane>
//                                     <TabPane tabId="6">
//                                         <MapMath onChosen={onChosen} />
//                                     </TabPane>
//                                 </TabContent>
//                             </CardBody>
//                         </Card>
//                     </Col>
//                 </Row>
//                 <div>
//                     <EditableMathField
//                         latex={latex}
//                         onChange={(mathField) => {
//                             setLatex(mathField.latex())
//                         }}
//                     />
//                     <p>{latex}</p>
//                 </div>
//             </CardBody>
//             <CardFooter>
//                 <Button.Ripple color="primary">
//                     Chèn công thức
//                 </Button.Ripple>
//             </CardFooter>
//         </Card>
//     )
// }

// export default memo(EquationEditor)