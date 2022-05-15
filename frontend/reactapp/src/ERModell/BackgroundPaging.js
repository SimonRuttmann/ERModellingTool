import React, {useEffect, useRef, useState} from "react";
import {Download, Upload} from "../ContentManager";

const BackgroundPaging = React.forwardRef (({elements, children,amountBackgroundPages, setAmountBackgroundPages}, ref) => {

    useEffect( () => {

        let pos = getMaxXAndYOfElements(elements);
        adjustBounds(pos.x, pos.y, elements)

    },[elements])


    // *****************************  Handle page increment/decrement  *****************************

    //TODO replace with correct values of er elements
    //Work:
    // 1. Add with and height properties to "drawBoardElement" (depending on text, width is dynamic),
    // 2. resolve elements instead of positions,
    // 3. apply offsets
    const elementWidthOffset = 150;
    const elementHeightOffset = 75;


    const drawBoardBorderOffset = 30; //the "border" of the background page, 30 px offset to the svg in height and width
    const oneBackgroundPageVertical = 810;
    const oneBackgroundPageHorizontal = 576;



    function getBackgroundPageBounds(pagesHorizontal, pagesVertical) {
        return {
            x: drawBoardBorderOffset + pagesHorizontal * oneBackgroundPageHorizontal,
            y: drawBoardBorderOffset + pagesVertical * oneBackgroundPageVertical
        }
    }

    /**
     * Standalone function to decrease the bounds,
     * e.g. minimize the amount of pages displayed, if possible
     * @required drawBoardElements elements inside the draw board need to be added to the state
     * @see drawBoardElements
     * @see setDrawBoardElements
     */
    function decreaseBounds(elements){

        let updatedPages = decreasePageIfNecessary(elements, amountBackgroundPages.horizontal, amountBackgroundPages.vertical)

        setAmountBackgroundPages(() => ({
            horizontal: updatedPages.horizontal,
            vertical: updatedPages.vertical
        }))
    }


    /**
     * Standalone function to increase the bounds,
     * e.g. increase the amount of pages displayed,
     * when the given coordinates are outside of displayed pages
     * The element does not need to be added to the state already
     * @param elementX The x-Coordinate of the element
     * @param elementY The y-Coordinate of the element
     */
    function increaseBounds(elementX, elementY){
        let updatedPages = increasePageIfNecessary(elementX, elementY, amountBackgroundPages.horizontal, amountBackgroundPages.vertical)

        setAmountBackgroundPages(() => ({
            horizontal: updatedPages.horizontal,
            vertical: updatedPages.vertical
        }))

    }

    /**
     * Function to increase or decrease the amount of pages
     * displayed depending on the elements within the draw board
     * @param elementX The x-Coordinate of the element
     * @param elementY The y-Coordinate of the element
     * @param elements Optional element object, if set, the current state will not be used (as it could be already updated)
     * @required drawBoardElements elements inside the draw board need to be added to the state
     * @see drawBoardElements
     * @see setDrawBoardElements
     */
    function adjustBounds(elementX, elementY, elements){ //elements ist optional!

        if(elements == null) return;

        let currentPagesHorizontal = amountBackgroundPages.horizontal;
        let currentPagesVertical = amountBackgroundPages.vertical;

        //TODO multiple set states
        let updatedIncreasedPages = increasePageIfNecessary(elementX, elementY, currentPagesHorizontal, currentPagesVertical)


        let updatedPages = decreasePageIfNecessary(elements, updatedIncreasedPages.horizontal, updatedIncreasedPages.vertical)



        setAmountBackgroundPages(() => ({
            horizontal: updatedPages.horizontal,
            vertical: updatedPages.vertical
        }))

    }


    function increasePageIfNecessary(x, y, pagesHorizontal, pagesVertical) {
        let page = getBackgroundPageBounds(pagesHorizontal, pagesVertical);


        x = x + elementWidthOffset;
        y = y + elementHeightOffset;

        let horizontal = pagesHorizontal;
        let vertical = pagesVertical;


        while (x > page.x || y > page.y){


            if (x > page.x) {
                horizontal++;
                x = x - oneBackgroundPageHorizontal;
            }


            if (y > page.y) {
                vertical++;
                y = y - oneBackgroundPageVertical;
            }

        }

        return {
            horizontal: horizontal,
            vertical: vertical
        }

    }

    function getMaxXAndYOfElements(elements){
        if(elements == null) return;
        let maxX = 0;
        let maxY = 0;

        elements.forEach( element => {
            if(element.x>maxX) maxX = element.x
            if(element.y>maxY) maxY = element.y
        })

        return {x: maxX, y: maxY}
    }

    function decreasePageIfNecessary(elements, pagesHorizontal, pagesVertical){

        //Get highest x and highest y, which are required to fit within the pages

        let maxX = 0;
        let maxY = 0;

        elements.forEach( element => {
            if(element.x>maxX) maxX = element.x
            if(element.y>maxY) maxY = element.y
        })

        maxX = maxX + elementWidthOffset;
        maxY = maxY + elementHeightOffset;

        return getPageReductionForPosition(maxX, maxY, pagesHorizontal, pagesVertical)
    }


    function getPageReductionForPosition(x, y, pagesHorizontal, pagesVertical){

        let bounds = getBackgroundPageBounds(pagesHorizontal, pagesVertical);

        let newHorizontalPages = getPageReductionForAxis(x, bounds.x, pagesHorizontal, oneBackgroundPageHorizontal)
        let newVerticalPages = getPageReductionForAxis(y, bounds.y, pagesVertical, oneBackgroundPageVertical)

        return {
            horizontal: newHorizontalPages,
            vertical: newVerticalPages
        }

    }

    function getPageReductionForAxis(elementPos, pagePos, amountPages, pageSize){

        let amountDecreaseOfPages = 0;
        let reducedSize = pagePos;

        //Condition: At least 1 pages needs to be remaining
        while(amountPages > amountDecreaseOfPages){

            reducedSize = reducedSize - pageSize;

            //Reduce page by 1
            if(reducedSize > elementPos) amountDecreaseOfPages++;

            //No further reduction possible, due to element
            else break;
        }

        return amountPages - amountDecreaseOfPages
    }
    //const backgroundPageRef = useRef(null)

    //const Child = React.cloneElement(children)
    //const backgroundPageSize = {
    //    horizontal: oneBackgroundPageHorizontal,
    //    vertical: oneBackgroundPageVertical
    //}

    //    <Child 
    //        backgroundPageRef = {backgroundPageRef}
    //        backgroundPageSize = {backgroundPageSize}
    //        amountBackgroundPages = {amountBackgroundPages}
    //        adjustBounds = {adjustBounds}/>
    return (
            <div className="drawboardBackgroundPage"
                ref={ref}
                style={{
                    height: `${oneBackgroundPageVertical * amountBackgroundPages.vertical}px`,
                    width:  `${oneBackgroundPageHorizontal *  amountBackgroundPages.horizontal}px`
            }}/>
    )
//Attempt 2
    //    const Child = React.cloneElement(children, {backgroundPageRef: backgroundPageRef})
});

export default BackgroundPaging;


