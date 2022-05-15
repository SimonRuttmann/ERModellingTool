import React from "react";
import {resolveRequiredWidth} from "../../Util/SvgUtils"


function StrongEntity({id, displayText, color, fontFamily, fontSize}){

    const x = 0;       const y = 0;
    let width = 137;   const height= 67;

    //If necessary, increase width to fit text
    width = resolveRequiredWidth(width, displayText, fontSize, fontFamily)


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
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{displayText}</text>

        </React.Fragment>
    )
}

export default StrongEntity