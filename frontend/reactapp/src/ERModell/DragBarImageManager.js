import React from "react";
import ErTypesEnum from "./ErTypesEnum";


const DragBarManager = ({erTypes}) => {

    function resolveErType(erType){
        return ErTypesEnum[erType];
    }

    function setDataTransfer(dragEvent, erType){
        return dragEvent.dataTransfer.setData('erType', erType)
    }

    return (
        <div className="leftSidebarContainer">
            <div className="leftSidebarTitle">Drag & drop me!</div>
            <hr />
            <div className="leftSidebarSelectionContainer">
                {erTypes.map((erType) => (

                    <div
                        key={erType+"_draggableContainer"}
                        onDragStart={(e) => {setDataTransfer(e, erType)}}
                        >
                        {resolveErType(erType)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DragBarManager;