// noinspection DuplicatedCode, Justification Shared Utils would highly increase dependencies

import React, {useLayoutEffect} from "react";
import SvgUtil from "../../../Services/Common/SvgUtils"
import DisplayConfiguration from "../../../Services/Configurations/DisplayConfiguration";

/**
 * Renders a drawBoardElement as weak relation
 * The fontSize and width/height of this element is determined by the text to display and the DisplayConfiguration
 * @param id                            The id of the drawBoardElement
 * @param displayText                   The text to render inside the element
 * @param color                         The color this element has to fill
 * @param fontFamily                    The font family the text should be rendered
 * @param fontSize                      The font size the text should be rendered
 * @param updateDrawBoardElementSize    A function, receiving the id, width and
 *                                      height to update the drawBoardElement size
 * @see DisplayConfiguration
 */
function WeakRelation({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    let width = 150;
    const widthHeightRatio = (2/3);

    let adjustedFontSize = fontSize;
    if(DisplayConfiguration.enableTextResizeBasedOnDisplayText){
        width = SvgUtil.resolveRequiredWidth(width, DisplayConfiguration.defaultTextToFit, fontSize, fontFamily)
        adjustedFontSize = SvgUtil.resolveRequiredFontSize(width, displayText, fontFamily, fontSize);
    }
    else if(DisplayConfiguration.enableSvgResizeBasedOnDisplayText){
        width = SvgUtil.resolveRequiredWidth(width, displayText, fontSize, fontFamily);
    }


    let height= width * widthHeightRatio;
    let yText = height/2;
    let xText = width/2;

    let pointLeft =   {x: "0",      y: height/2}
    let pointTop =    {x: width/2,  y: "0"}
    let pointRight =  {x: width,    y: height/2}
    let pointBottom = {x: width/2,  y: height}

    let path = `M ${pointLeft.x} ${pointLeft.y}   L ${pointTop.x} ${pointTop.y}` +
               `L ${pointRight.x} ${pointRight.y} L ${pointBottom.x} ${pointBottom.y} Z`

    const offsetX = 10;
    const offsetY = 10 * widthHeightRatio;

    let innerPath = `M ${pointLeft.x + offsetX} ${pointLeft.y}   L ${pointTop.x} ${pointTop.y + offsetY}` +
        `            L ${pointRight.x - offsetX} ${pointRight.y} L ${pointBottom.x} ${pointBottom.y - offsetY} Z`

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

            <path
                //id
                id={id}

                //display style
                d={innerPath}
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
                fontSize={adjustedFontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{displayText}</text>

        </React.Fragment>
    )
}

export default WeakRelation