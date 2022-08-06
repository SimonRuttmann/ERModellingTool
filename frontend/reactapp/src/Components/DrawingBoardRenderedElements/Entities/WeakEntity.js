// noinspection DuplicatedCode, Justification Shared Utils would highly increase dependencies

import React, {useLayoutEffect} from "react";
import SvgUtil from "../../../Services/Common/SvgUtils"
import DisplayConfiguration from "../../../Services/Configurations/DisplayConfiguration";

/**
 * Renders a drawBoardElement as weak entity
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
function WeakEntity({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    const xOuter = 0;       const yOuter = 0;
    let widthOuter = 137;   const heightOuter = 67;

    const xInner = xOuter + 5;                  const yInner = yOuter + 5;
    let widthInner = widthOuter - 10;           const heightInner = heightOuter - 10;

    let adjustedFontSize = fontSize;
    if(DisplayConfiguration.enableTextResizeBasedOnDisplayText){
        widthInner = SvgUtil.resolveRequiredWidth(widthInner, DisplayConfiguration.defaultTextToFit, fontSize, fontFamily)
        adjustedFontSize = SvgUtil.resolveRequiredFontSize(widthInner, displayText, fontFamily, fontSize);
    }
    else if(DisplayConfiguration.enableSvgResizeBasedOnDisplayText){
        widthInner = SvgUtil.resolveRequiredWidth(widthInner, displayText, fontSize, fontFamily);
    }


    widthOuter = widthInner + 10;

    useLayoutEffect( () => {

        updateDrawBoardElementSize(id, widthOuter, heightOuter)

    },[widthOuter, heightOuter])


    return (
        <React.Fragment>

            <rect
                //id
                id={id}

                //position
                y={yOuter}
                x={xOuter}

                //display style
                height={heightOuter}
                width={widthOuter}
                stroke="#000"
                fill={color}/>

            <rect
                //id
                id={id}

                //position
                y={yInner}
                x={xInner}

                //display style
                height={heightInner}
                width={widthInner}
                stroke="#000"
                fill={color}/>

            <text
                //id
                id={id}

                //position
                x={xOuter + widthOuter / 2}
                y={yOuter + heightOuter / 2}

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

export default WeakEntity