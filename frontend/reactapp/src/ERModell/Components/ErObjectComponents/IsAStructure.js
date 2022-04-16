import React from "react";
//import resolveRequiredWidth from "../SvgUtil/SvgUtils"


function IsAStructure({id, displayText, color, fontFamily, fontSize}){

    let width = 100;
    const widthHeightRatio = (2/3);

    //Comment in and remove constantDisplayText to make text editable and scalable

    //If necessary, increase width to fit text
    //width = resolveRequiredWidth(width, displayText, fontSize, fontFamily)
    const constantDisplayText = "IsA"

    let height= width * widthHeightRatio;
    let yText = height / 2 / widthHeightRatio - 5;
    let xText = width/2;


    let pointTop =    {x: width/2,  y: "0"}
    let pointLeft =   {x: "0",      y: height}
    let pointRight =  {x: width,    y: height}

    let path = `M ${pointTop.x} ${pointTop.y} L ${pointLeft.x} ${pointLeft.y} L ${pointRight.x} ${pointRight.y} Z`

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