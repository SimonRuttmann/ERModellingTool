// noinspection DuplicatedCode, Justification Shared Utils would highly increase dependencies

import React, {useLayoutEffect} from "react";
import SvgUtil from "../../../Services/Common/SvgUtils"
import DisplayConfiguration from "../../../Services/Configurations/DisplayConfiguration";

/**
 * Renders a drawBoardElement as weak identifying attribute
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
function WeakIdentifyingAttribute({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    const xCenterPosition = 122;         const yCenterPosition = 37;

    let xRadiusOuter = 100;              const yRadiusOuter = 33;


    let adjustedFontSize = fontSize;
    if(DisplayConfiguration.enableTextResizeBasedOnDisplayText){
        xRadiusOuter = ( SvgUtil.resolveRequiredWidth(xRadiusOuter * 2, DisplayConfiguration.defaultTextToFit, fontSize, fontFamily) / 2 )
        adjustedFontSize = SvgUtil.resolveRequiredFontSize(xRadiusOuter * 2, displayText, fontFamily, fontSize);
    }
    else if(DisplayConfiguration.enableSvgResizeBasedOnDisplayText){
        xRadiusOuter = ( SvgUtil.resolveRequiredWidth(xRadiusOuter * 2, displayText, fontSize, fontFamily) / 2 ) * 0.9
    }


    const yLinePosition = yCenterPosition + (fontSize / 2) + 5;
    let xLinePositionStart = xCenterPosition - xRadiusOuter * 0.85;
    let xLinePositionEnd = xCenterPosition + xRadiusOuter * 0.85;

    useLayoutEffect(() => {

        let maxX =  (xRadiusOuter + xCenterPosition);
        let maxY =  (yRadiusOuter + yCenterPosition);

        updateDrawBoardElementSize(id, maxX, maxY);
    },[xRadiusOuter, yRadiusOuter]);

    return (
        <React.Fragment>

            <ellipse
                //id
                id={id}

                //position
                cy={yCenterPosition}
                cx={xCenterPosition}

                //display style
                ry={yRadiusOuter}
                rx={xRadiusOuter}
                stroke="#000"
                fill={color}/>

            <text
                //id
                id={id}

                //position
                x={xCenterPosition}
                y={yCenterPosition}

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

            <line
                id={id}
                x1={xLinePositionStart} y1={yLinePosition}
                x2={xLinePositionEnd}   y2={yLinePosition}
                stroke="black"
                strokeWidth="3"
                strokeDasharray="5,5"/>

        </React.Fragment>
    )

}

export default WeakIdentifyingAttribute