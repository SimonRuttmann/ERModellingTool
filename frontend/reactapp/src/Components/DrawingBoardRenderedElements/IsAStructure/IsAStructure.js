import React, {useLayoutEffect} from "react";

/**
 * Renders a drawBoardElement as isA-Structure
 * This element currently does not resize, as it has no variable text to hold
 * @param id                            The id of the drawBoardElement
 * @param displayText                   The text to render inside the element
 * @param color                         The color this element has to fill
 * @param fontFamily                    The font family the text should be rendered
 * @param fontSize                      The font size the text should be rendered
 * @param updateDrawBoardElementSize    A function, receiving the id, width and
 *                                      height to update the drawBoardElement size
 * @see DisplayConfiguration
 */
function IsAStructure({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    let width = 100;
    const widthHeightRatio = (2/3);

    //Edit this to make the IsA editable and scalable
    const constantDisplayText = "IsA"

    let height= width * widthHeightRatio;
    let yText = height / 2 / widthHeightRatio - 5;
    let xText = width/2;


    let pointTop =    {x: width/2,  y: "0"}
    let pointLeft =   {x: "0",      y: height}
    let pointRight =  {x: width,    y: height}

    let path = `M ${pointTop.x} ${pointTop.y} L ${pointLeft.x} ${pointLeft.y} L ${pointRight.x} ${pointRight.y} Z`

    useLayoutEffect( () => {

        updateDrawBoardElementSize(id, width, height)

    },[width, height])

    return (
        <React.Fragment>

            <path
                //id
                id={id}

                //display style
                d={path}
                stroke="#000"
                fill={color} />

            <text
                //id
                id={id}

                //position
                x={xText}
                y={yText}

                //alignment
                dominantBaseline="middle"
                textAnchor="middle"

                //display text style
                fontFamily={fontFamily}
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{constantDisplayText}</text>

        </React.Fragment>
    )
}

export default IsAStructure