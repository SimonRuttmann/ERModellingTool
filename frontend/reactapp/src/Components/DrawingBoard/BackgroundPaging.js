import React, {useEffect} from "react";

/**
 * This component is responsible for the creation of the background pages
 * Also it registers on changes of the draw board elements to adjust the amount of pages rendered
 * Those pages will affect the svg, where elements will be rendered
 *
 * This component is implemented as forward ref to enable the parent component
 * to hold a reference to the background page
 * @see SvgResizer
 */
const BackgroundPaging = React.forwardRef ((
    {   elements, children,
        drawBoardBorderOffset, backgroundPageSize,
        amountBackgroundPages, setAmountBackgroundPages}, ref) => {

    useEffect( () => {

        adjustBounds(elements)

    },
    //Justification: Performance increase, methods should not be used as callback,
    //               as they would depend on properties which do not affect the callback
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [elements])


    // *****************************  Handle page increment/decrement  *****************************


    const oneBackgroundPageVertical = backgroundPageSize.vertical;
    const oneBackgroundPageHorizontal = backgroundPageSize.horizontal;


    function getBackgroundPageBounds(pagesHorizontal, pagesVertical) {
        return {
            x: drawBoardBorderOffset + pagesHorizontal * oneBackgroundPageHorizontal,
            y: drawBoardBorderOffset + pagesVertical * oneBackgroundPageVertical
        }
    }


    /**
     * Function to increase or decrease the amount of pages
     * displayed depending on the elements within the draw board
     * @param elements drawBoardElements on the draw board
     * @see drawBoardElements
     * @see setAmountBackgroundPages
     */
    function adjustBounds(elements){

        let pos = getMaxXAndYOfElements(elements);

        const maxX = pos.x;
        const maxY = pos.y;

        let currentPagesHorizontal = amountBackgroundPages.horizontal;
        let currentPagesVertical = amountBackgroundPages.vertical;


        let updatedIncreasedPages = increasePageIfNecessary(maxX, maxY, currentPagesHorizontal, currentPagesVertical)

        let updatedPages = decreasePageIfNecessary(maxX, maxY, updatedIncreasedPages.horizontal, updatedIncreasedPages.vertical)


        setAmountBackgroundPages(() => ({
            horizontal: updatedPages.horizontal,
            vertical: updatedPages.vertical
        }))

    }


    function increasePageIfNecessary(x, y, pagesHorizontal, pagesVertical) {
        let page = getBackgroundPageBounds(pagesHorizontal, pagesVertical);

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
            if(element.x + element.width  > maxX) maxX = element.x + element.width
            if(element.y + element.height > maxY) maxY = element.y + element.height
        })

        return {x: maxX + drawBoardBorderOffset, y: maxY + drawBoardBorderOffset}
    }

    function decreasePageIfNecessary(x, y, pagesHorizontal, pagesVertical){

        //Get highest x and highest y, which are required to fit within the pages
        return getPageReductionForPosition(x, y, pagesHorizontal, pagesVertical)
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

    return (
            <div className="drawBoardBackgroundPage"
                ref={ref}
                style={{
                    height: `${oneBackgroundPageVertical * amountBackgroundPages.vertical}px`,
                    width:  `${oneBackgroundPageHorizontal *  amountBackgroundPages.horizontal}px`
            }}/>
    )

});

export default BackgroundPaging;


