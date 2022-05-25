import React, {useLayoutEffect} from "react";
import {resolveRequiredWidth} from "../../Util/SvgUtils"


function NormalAttribute({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    const xCenterPosition = 122;         const yCenterPosition = 37;

    let xRadiusOuter = 100;              const yRadiusOuter = 33;

    //If necessary, increase width to fit text
    xRadiusOuter = resolveRequiredWidth(xRadiusOuter * 2, displayText, fontSize, fontFamily) / 2

    useLayoutEffect(() => {

        let maxX =  (xRadiusOuter + xCenterPosition);
        let maxY =  (yRadiusOuter + yCenterPosition);

        updateDrawBoardElementSize(id, maxX, maxY)
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
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{displayText}</text>

        </React.Fragment>
    )
}

export default NormalAttribute