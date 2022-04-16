import React from "react";
import resolveRequiredWidth from "../../SvgUtil/SvgUtils"


function MultivaluedAttribute({id, displayText, color, fontFamily, fontSize}){

    const xCenterPosition = 122;         const yCenterPosition = 37;

    let xRadiusOuter = 100;              const yRadiusOuter = 33;
    let xRadiusInner = xRadiusOuter - 5; const yRadiusInner = yRadiusOuter - 5;

    //If necessary, increase width to fit text
    xRadiusInner = resolveRequiredWidth(xRadiusInner * 2, displayText, fontSize, fontFamily) / 2
    xRadiusOuter = xRadiusInner + 5;


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

            <ellipse
                //id
                id={id}

                cy={yCenterPosition}
                cx={xCenterPosition}

                //display style
                ry={yRadiusInner}
                rx={xRadiusInner}
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

export default MultivaluedAttribute