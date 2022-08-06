import React, {useEffect, useLayoutEffect, useState} from "react";

/**
 * Component to resize svg based on the windows size, the size of the parent element
 * and the size of the background pages
 *
 * This Component will ensure that the svg is always at the maximum height possible,
 * to ensure all elements inside are displayed
 *
 * !! This component has high influence on performance and is therefore performance optimized !!
 *
 * @param children All children, which should be displayed inside the resized svg
 * @param mostOuterDiagramDivRef The reference to the parent dom element
 * @param backgroundPageRef The reference to the background page element
 * @param drawBoardBorderOffset The offset of the svg to the root element in the dom
 * @param backgroundPageSize The size of the background pages
 * @param amountBackgroundPages The amount of background pages currently displayed
 * @param addDrawBoardElement Function to execute on the onDrop event
 * @returns {JSX.Element}
 */
const SvgResizer = ({   children, mostOuterDiagramDivRef, backgroundPageRef,
                        drawBoardBorderOffset, backgroundPageSize, amountBackgroundPages,
                        onDropHandler}) => {
    
    /**
     * The svg size must be adjusted depending on the size of the area covered by the background pages
     * The size itself is stored within this state
     */
    const [svgSize, setSvgSize] = useState({
        width: `calc(100% - ${drawBoardBorderOffset}px)`,
        height: `calc(100% - ${drawBoardBorderOffset}px)`
    })

    /**
     * Method to create rerender when the window is resized
     */
    const [, setDimensions] = useState({height: window.innerHeight, width: window.innerWidth})

    /**
     * Method to schedule functions
     * @param fn The function to execute after a given time
     * @param ms The amount of time in ms
     * @returns {(function(*): void)|*}
     */
    function debounce(fn, ms) {
        let timer
        return _ => {
            clearTimeout(timer)
            timer = setTimeout(_ => {
                timer = null
                fn.apply(this, arguments)
            }, ms)
        };
    }

    /**
     * This useEffect is used to detect window resizing (zoom, or making the window smaller)
     * After a window resize is detected it will trigger a rerender, required for useLayoutEffect
     * to resize the svg correctly
     * The method is debounced with 200ms to increase performance
     */
    useEffect( () => {

        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }, 200)

        window.addEventListener('resize', debouncedHandleResize)

        return () => {
            window.removeEventListener('resize', debouncedHandleResize)
        }

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
            onDrop={(e) => onDropHandler(e)}
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