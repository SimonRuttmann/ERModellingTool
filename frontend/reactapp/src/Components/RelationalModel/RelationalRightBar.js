// noinspection JSUnresolvedVariable Justification, variables are resolved

import React from 'react';
import {resolveObjectById} from "../../Services/Common/ObjectUtil";
import {SqlDataTypes} from "../../Services/DrawBoardModel/SqlDataTypes";
import TableUtil from "../../Services/Common/TableUtil";

/**
 * Renders the right sidebar containing information for ane table
 * On this sidebar a selector is provided to change the dataType for the column
 *
 * @param selectedObjectId  The currently selected object id
 * @param drawBoardElements The elements (tables) in the DrawBoard
 * @param changeDataType    A function to change the dataType of a column
 */
const RelationalRightBar = ({selectedObjectId, drawBoardElements, changeDataType}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements)
    if (selectedObject == null) return null;


    const sortedColumns = TableUtil.sortColumnsOfTableImmutable(selectedObject);

    const handleChangeDataType = (columnId, dataType) => {
        changeDataType(selectedObject.id, columnId, dataType)
    }

    const getDataType = (column) => {
        if(column.dataType == null) return SqlDataTypes.INT;
        return column.dataType;
    }
    return (

        <div
            className="rightSidebarContainer"
            onClick={(e) => e.stopPropagation()}>

            <div className={"spacerBig"}/>
            <div>{selectedObject.displayName}</div>
            <div className={"spacerBig"}/>
            {sortedColumns.filter(column => !column.primaryKey && !column.foreignKey).map( (column) => (
                <div key={column.id}>
                    <div className="spacerSmall"/>
                    {column.displayName}
                    <div className="spacerSmall"/>

                    <select className="select" defaultValue={getDataType(column)} onChange={ (e) => handleChangeDataType(column.id, e.target.value)}>
                        <option className="select-items" value={SqlDataTypes.INT}       >{SqlDataTypes.INT}</option>
                        <option className="select-items" value={SqlDataTypes.FLOAT}     >{SqlDataTypes.FLOAT}</option>
                        <option className="select-items" value={SqlDataTypes.BOOLEAN}   >{SqlDataTypes.BOOLEAN}</option>
                        <option className="select-items" value={SqlDataTypes.TEXT}      >{SqlDataTypes.TEXT}</option>
                        <option className="select-items" value={SqlDataTypes.DATE}      >{SqlDataTypes.DATE}</option>
                        <option className="select-items" value={SqlDataTypes.TIMESTAMP} >{SqlDataTypes.TIMESTAMP}</option>
                    </select>

                    <div className="spacerSmall"/>
                </div>
            ))}

            <div className={"spacerBig"}/>

        </div>
    );
};

export default RelationalRightBar;
