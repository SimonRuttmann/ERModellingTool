import React, {useLayoutEffect} from "react";
import {resolveRequiredWidth} from "../../Util/SvgUtils"


function WeakRelation({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize}){

    let width = 150;
    const widthHeightRatio = (2/3);

    //If necessary, increase width to fit text
    width = resolveRequiredWidth(width, displayText, fontSize, fontFamily)

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

        console.log("update size")
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
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{displayText}</text>

        </React.Fragment>
    )
}

export default WeakRelation