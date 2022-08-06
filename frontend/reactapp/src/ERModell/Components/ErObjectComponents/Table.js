import React, {useLayoutEffect} from "react";
import SvgUtil from "../Util/SvgUtils"
import Column from "./Column";
import TableUtil from "../../TableUtil";



function Table({id, displayText, color, fontFamily, fontSize, updateDrawBoardElementSize, object}){


    /*

             |--------------------------------------------|
             |                 Table Name                 |
             |--------------------------------------------|
             | [PK] [FK] | Column Display Name | DataType |
             | [PK] [FK] | Column Display Name | DataType |
             | [PK] [FK] | Column Display Name | DataType |
             | [PK] [FK] | Column Display Name | DataType |
             | [PK] [FK] | Column Display Name | DataType |
             | [PK] [FK] | Column Display Name | DataType |
             |--------------------------------------------|

     */


    const x = 0;       const y = 0;

    let width = 300;

    const columnHeight= 40;
    const headerHeight = 60;

    const tableHeight = object.columns.length * columnHeight + headerHeight;

    //If necessary, increase width to fit text
    let minCalcWidth = SvgUtil.resolveRequiredWidth(width, displayText, fontSize, fontFamily)

    if(minCalcWidth > width) width = minCalcWidth;


    useLayoutEffect( () => {

        updateDrawBoardElementSize(id, width, tableHeight)

    },[width, tableHeight])

    const sortedColumns = TableUtil.sortColumnsOfTableImmutable(object);

    return (
        <React.Fragment>

            {/* Table header */}
            <rect
                //id
                id={id}

                //position
                y={y}
                x={x}

                //display style
                height={headerHeight}
                width={width}
                stroke="#000"
                fill={color}/>

            <text
                //id
                id={id}

                //position
                x={x + width / 2}
                y={y + headerHeight / 2}

                //alignment
                dominantBaseline="middle"
                textAnchor="middle"

                //display text style
                fontFamily={fontFamily}
                fontSize={fontSize * 1.5}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{displayText}</text>

            {sortedColumns.map( (column, i) => (
                <Column key={column.id}
                        x={0}
                        y={ i * columnHeight + headerHeight}
                        width={width}
                        height={columnHeight}
                        column={column}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        />
            ))}
        </React.Fragment>
    )


}

export default Table

