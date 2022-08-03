import React from 'react';
import {resolveObjectById} from "./Components/Util/ObjectUtil";
import {SqlDataTypes} from "./Components/ErObjectComponents/SqlDataTypes";

const RelationalRightBar = ({selectedObjectId, drawBoardElements, changeDataType}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements)
    if (selectedObject == null) return null;

    //TODO duplication mit table
    const sortedColumns = selectedObject.columns.sort( (a,b) => {
        if( a.primaryKey &&  b.primaryKey) {

            if( a.foreignKey &&  b.foreignKey) return  0;
            if( a.foreignKey && !b.foreignKey) return +1;
            if(!a.foreignKey &&  b.foreignKey) return -1;
            if(!a.foreignKey && !b.foreignKey) return  0;

        }
        if( a.primaryKey && !b.primaryKey) return -1;
        if(!a.primaryKey &&  b.primaryKey) return +1;
        if(!a.primaryKey && !b.primaryKey){

            if( a.foreignKey &&  b.foreignKey) return  0;
            if( a.foreignKey && !b.foreignKey) return -1;
            if(!a.foreignKey &&  b.foreignKey) return +1;
            if(!a.foreignKey && !b.foreignKey) return  0;

        }
        return 0;
    });

    const handleChangeDataType = (columnId, dataType) => {
        changeDataType(selectedObject.id, columnId, dataType)
    }
//TODO duplicate column
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
