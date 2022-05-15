import React, {useLayoutEffect, useRef, useState} from "react";
import DrawBoardElement from "./Components/DrawBoard/DrawBoardElement";

/**
 * BackgroundPageSize:
 * OneBackgroundPageHorizontal
 * OneBackgroundPageVertical
 * AmountBackgroundPages
 * Horizontal
 * Vertical
 */
/**
 *
 * @param drawBoardBorderOffset
 * @param oneBackgroundPageHorizontal
 * @param amountBackgroundPages
 * @constructor
 */
const SvgResizer = ({children, mostOuterDiagramDivRef, backgroundPageRef, drawBoardBorderOffset, backgroundPageSize, amountBackgroundPages}) => {
    
    /**
     * The svg size must be adjusted depending on the size of the area covered by the background pages
     * The size itself is stored within this state
     */
    const [svgSize, setSvgSize] = useState({
        width: `calc(100% - ${drawBoardBorderOffset}px)`,
        height: `calc(100% - ${drawBoardBorderOffset}px)`
    })

    /**
     * reference to the background pages
     * @type {React.MutableRefObject<null>}
     */
 //   const backgroundPageRef = useRef(null)

    /**
     * reference to the most outer div of the draw board element
     * @type {React.MutableRefObject<null>}
     */
  //  const mostOuterDiagramDivRef = useRef(null)
    // |                   Render                                                   |
    //We use useLayoutEffect  (AnyStateChange, PropChange) | -> Calculate Dom measurements -> run useLayoutEffect -> prints dom to screen  -> use effect
    // 1. Runs synchronously after react has performed all dom mutations ! Runs before the dom is printed to the screen
    // In contrast, useEffect runs after react render
    // If the effect would mutate the dom (via a dom node ref) and the dom mutation will change the appreacreade of the dom node
    // We need useLayoutEffect, as use Effect would cause a "flicker" when your dom mutations take effect

    /**
     * If the background pages are not greater than the viewport, the svg area is set
     * to a 100% - the offset of the svg on the top and left
     *
     * If the background pages increase and create an overflow in the parent element
     * the svg is increased to the size of the area, provided by the
     * background pages (with the border of the page area)
     */
    useLayoutEffect( () => {
        //BackgroundPage

        //noinspection JSUnresolvedVariable Justification, variable is resolved
        let withPage = backgroundPageRef.current.offsetWidth;
        //noinspection JSUnresolvedVariable
        let heightPage = backgroundPageRef.current.offsetHeight;

        //The most outer div

        //noinspection JSUnresolvedVariable Justification, variable is resolved
        let mostOuterWidth = mostOuterDiagramDivRef.current.offsetWidth;
        //noinspection JSUnresolvedVariable Justification, variable is resolved
        let mostOuterHeight = mostOuterDiagramDivRef.current.offsetHeight;

        //Set the size to 100% - the offset of the svg to the left and top
        let svgWidth = `calc(100% - ${drawBoardBorderOffset}px)`;
        let svgHeight = `calc(100% - ${drawBoardBorderOffset}px)`;

        //Override the size, if the background page is greater than the 100% - offset (== pages overflow)
        if(withPage + backgroundPageSize.horizontal > mostOuterWidth){
            svgWidth = `${backgroundPageSize.horizontal * amountBackgroundPages.horizontal + backgroundPageSize.horizontal}px`
        }

        if(heightPage + backgroundPageSize.vertical > mostOuterHeight){
            svgHeight = `${backgroundPageSize.vertical * amountBackgroundPages.vertical + backgroundPageSize.vertical}px`
        }

        setSvgSize(()=> ({
            height: svgHeight,
            width: svgWidth
        }))

    },
    [
        amountBackgroundPages.horizontal,
        amountBackgroundPages.vertical,
        backgroundPageSize.horizontal,
        backgroundPageSize.vertical,
        drawBoardBorderOffset
    ])

    const styleProps= {
        position: "absolute",
        left: `${drawBoardBorderOffset}px`,
        top: `${drawBoardBorderOffset}px`,
        height: svgSize.height,
        width:  svgSize.width
    }

    const CardHead = props =>
        <div>
            {children}
        </div>

    return(
        <svg
            id="boxesContainer"
            className="drawboardDragArea"
            onDragOver={(e) => e.preventDefault()} //enable "dropping"
            onDrop={(e) => addDrawBoardElement(e)}
            style={{
                position: "absolute",                   //TODO
                left: `${drawBoardBorderOffset}px`,
                top: `${drawBoardBorderOffset}px`,
                height: svgSize.height,
                width:  svgSize.width
            }}

        >
            {children}
        </svg>

    )


}