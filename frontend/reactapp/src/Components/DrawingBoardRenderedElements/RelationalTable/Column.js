// noinspection JSUnresolvedVariable Justification, variables are resolved

import React from "react";
import {SqlDataTypes} from "../../../Services/DrawBoardModel/SqlDataTypes";

/**
 * Renders a column based on the given column data object
 * A column has always a Table-component as parent
 *
 * @param width                         The width of this element, defined by the Table-component
 * @param height                        The height of this element, defined by the Table-component
 * @param x                             The x-coordinate of this element, defined by the Table-component
 * @param y                             The x-coordinate of this element, defined by the Table-component
 * @param fontFamily                    The font family the text should be rendered
 * @param fontSize                      The font size the text should be rendered
 * @param column                        The data, this column has to render
 */
function Column({ width, height, x, y, fontFamily, fontSize, column}){
    /*
             |--------------------------------------------|
             | [PK] [FK] | Column Display Name | DataType |
             |--------------------------------------------|
     */

    const getDataType = (column) => {
        if(column.dataType == null) return SqlDataTypes.INT;
        return column.dataType;
    }

    let primaryKey =
        <svg x={x + 5} y={y + 5} width={30} height={30} viewBox="0 0 16 16">
            <g fill="orange" id={column.id}>
                <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </g>
        </svg>

    let foreignKey =
        <svg x={x + 40} y={y + 5} width={30} height={30} viewBox="0 0 16 16">
            <g fill="blue" id={column.id}>
                <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </g>
        </svg>


    return (
        <React.Fragment>

            <g id={column.id} >


            <rect
                //id
                id={column.id}

                //position
                y={y}
                x={x}

                //display style
                height={height}
                width={width}
                stroke="#000"
                fill="white"
            />

            <text
                //id
                id={column.id}

                //position
                x={x + 80}
                y={y + height / 2}

                //alignment
                dominantBaseline="middle"
                textAnchor="left"

                //display text style
                fontFamily={fontFamily}
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{column.displayName}</text>

            {column.primaryKey || column.foreignKey ? null :
            <text
                //id
                id={column.id}

                //position
                x={x + 200}
                y={y + height / 2}

                //alignment
                dominantBaseline="middle"
                textAnchor="left"

                //display text style
                fontFamily={fontFamily}
                fontSize={fontSize}

                //display style
                stroke="#000"
                strokeWidth="0"
                fill="#000000"

            >{getDataType(column)}</text>
            }

                { column.primaryKey ? primaryKey : null}

                { column.foreignKey ? foreignKey : null}

            </g>


        </React.Fragment>
    )
}

export default Column
