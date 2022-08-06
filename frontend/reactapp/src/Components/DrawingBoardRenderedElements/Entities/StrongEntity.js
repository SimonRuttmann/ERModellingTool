// noinspection DuplicatedCode, Justification Shared Utils would highly increase dependencies

import React, {useLayoutEffect} from "react";
import SvgUtil from "../../../Services/Common/SvgUtils"
import DisplayConfiguration from "../../../Services/Configurations/DisplayConfiguration";

/**
 * Renders a drawBoardElement as strong entity
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
function StrongEntity({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    const x = 0;       const y = 0;
    let width = 137;   const height= 67;

    let adjustedFontSize = fontSize;
    if(DisplayConfiguration.enableTextResizeBasedOnDisplayText){
        width = SvgUtil.resolveRequiredWidth(width, DisplayConfiguration.defaultTextToFit, fontSize, fontFamily)
        adjustedFontSize = SvgUtil.resolveRequiredFontSize(width, displayText, fontFamily, fontSize);
    }
    else if(DisplayConfiguration.enableSvgResizeBasedOnDisplayText){
        width = SvgUtil.resolveRequiredWidth(width, displayText, fontSize, fontFamily);
    }


    useLayoutEffect( () => {

        updateDrawBoardElementSize(id, width, height)

    },[width, height])


    return (
        <React.Fragment>

            <rect
                //id
                id={id}

                //position
                y={y}
                x={x}

                //display style
                height={height}
                width={width}
                stroke="#000"
                fill={color}/>

            <text
                //id
                id={id}

                //position
                x={x + width / 2}
                y={y + height / 2}

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

export default StrongEntity