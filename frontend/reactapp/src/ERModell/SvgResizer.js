import React, {useLayoutEffect, useState} from "react";

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
const SvgResizer = ({children, mostOuterDiagramDivRef, backgroundPageRef, drawBoardBorderOffset, backgroundPageSize, amountBackgroundPages, addDrawBoardElement}) => {
    
    /**
     * The svg size must be adjusted depending on the size of the area covered by the background pages
     * The size itself is stored within this state
     */
    const [svgSize, setSvgSize] = useState({
        width: `calc(100% - ${drawBoardBorderOffset}px)`,
        height: `calc(100% - ${drawBoardBorderOffset}px)`
    })

    /**
     * If the background pages are not greater than the viewport, the svg area is set
     * to a 100% - the offset of the svg on the top and left
     *
     * If the background pages increase and create an overflow in the parent element
     * the svg is increased to the size of the area, provided by the
     * background pages (with the border of the page area)
     */
    useLayoutEffect( () => {

        if(backgroundPageRef.current == null ) return;
        if(mostOuterDiagramDivRef.current == null ) return;


        //noinspection JSUnresolvedVariable Justification, variable is resolved
        let withPage = backgroundPageRef.current.offsetWidth;
        //noinspection JSUnresolvedVariable Justification, variable is resolved
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
    //Justification: Performance increase, methods should not be used as callback,
    //               as they would depend on properties which do not affect the callback
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [
        amountBackgroundPages.horizontal,
        amountBackgroundPages.vertical,
        backgroundPageSize.horizontal,
        backgroundPageSize.vertical,
        drawBoardBorderOffset
    ])


    return(
        <svg
            id="boxesContainer"
            className="drawBoardDragArea"
            onDragOver={(e) => e.preventDefault()} //enable "dropping"
            onDrop={(e) => addDrawBoardElement(e)}
            style={{
                position: "absolute",
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

export default SvgResizer;