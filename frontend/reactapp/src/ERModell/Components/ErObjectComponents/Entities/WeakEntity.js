import React, {useLayoutEffect} from "react";
import {resolveRequiredWidth} from "../../Util/SvgUtils"


function WeakEntity({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    const xOuter = 0;       const yOuter = 0;
    let widthOuter = 137;   const heightOuter = 67;

    const xInner = xOuter + 5;                  const yInner = yOuter + 5;
    let widthInner = widthOuter - 10;           const heightInner = heightOuter - 10;

    //If necessary, increase width to fit text
    widthInner = resolveRequiredWidth(widthInner, displayText, fontSize, fontFamily)
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
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{displayText}</text>

        </React.Fragment>
    )
}

export default WeakEntity