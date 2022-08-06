import BackgroundPaging from "./BackgroundPaging";
import React, {useRef, useState} from "react";
import {useXarrow, Xwrapper} from "react-xarrows";
import SvgResizer from "./SvgResizer";
import DrawBoardElement from "./DrawBoardElement";
import ConnectionElement from "./ConnectionElement";
import {DiagramTypes} from "../../Services/DrawBoardModel/Diagram";

/**
 * This component is responsible for all interaction and render logic regarding the drawing area
 *
 * It creates a svg each given DrawBoardElement-Component will be placed into
 * Also creates a second svg to hold all Connection-Components
 *
 * In addition, background paging and svg resizing is applied
 *
 * @param children The elements to render within the draw board
 * @param onDropHandler A function to register on any onDrop event of the draw board
 * @param drawBoardElements The data of the elements to render within the draw board, required for the background paging
 * @param drawBoardBorderOffset The offset of the diagram in the viewport
 * @param diagramType The type of diagram, affects the position of this component based on css
 *
 * For example usages see
 * @see RelationalContentManager
 * @see ErContentManager
 *
 * For elements inside the drawBoard see
 * @see DrawBoardElement
 * @see ConnectionElement
 */
const DrawBoard = ({children, onDropHandler, drawBoardElements, drawBoardBorderOffset, diagramType}) => {

    const updateConnections = useXarrow();

    const [amountBackgroundPages,setAmountBackgroundPages] = useState({horizontal: 1, vertical: 1})

    const backgroundPageSize = {
        vertical: 810,
        horizontal: 576
    }

    /**
     * reference to the background pages
     * @type {React.MutableRefObject<null>}
     */
    const backgroundPageRef = useRef(null)

    /**
     * reference to the most outer div of the draw board element
     * @type {React.MutableRefObject<null>}
     */
    const mostOuterDiagramDivRef = useRef(null)

    let outerStyle;
    
    switch (diagramType) {
        case DiagramTypes.erDiagram: outerStyle = "outerDrawBoardContainerEr"; break;
        case DiagramTypes.relationalDiagram: outerStyle = "outerDrawBoardContainerRelational"; break;
    }

    outerStyle += " scrollAble";

    return (
        <React.Fragment>

            <div id="mostOuter"
                 className={outerStyle}
                 ref={mostOuterDiagramDivRef}
                 onScroll={updateConnections}>

                <Xwrapper>
                    <BackgroundPaging elements={drawBoardElements}

                                      backgroundPageSize={backgroundPageSize}
                                      drawBoardBorderOffset={drawBoardBorderOffset}

                                      amountBackgroundPages={amountBackgroundPages}
                                      setAmountBackgroundPages={setAmountBackgroundPages}
                                      ref={backgroundPageRef}/>


                    <SvgResizer mostOuterDiagramDivRef={mostOuterDiagramDivRef}
                                backgroundPageRef={backgroundPageRef}

                                backgroundPageSize={backgroundPageSize}
                                drawBoardBorderOffset={drawBoardBorderOffset}
                                amountBackgroundPages={amountBackgroundPages}


                                onDropHandler={onDropHandler}>

                        {React.Children.toArray(children).filter(({type}) => type===DrawBoardElement)}


                    </SvgResizer>

                    {React.Children.toArray(children).filter(({type}) => type===ConnectionElement)}

                </Xwrapper>

            </div>
        </React.Fragment>
    )
}

export default DrawBoard;