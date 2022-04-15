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


            <div className="leftSidebarTitle">Drag & drop me!</div> {/* Title */}
            <hr />
            <div className="leftSidebarSelectionContainer">         {/* Container */}
                {erTypes.map((erType) => (
                    <div
                        className="leftSideBarElement"
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

// Entities
// Strong Entity        Weak Entity

// Relations
// Strong Relation      Weak Relation

// Attributes
// Attribute            AttributeIdentifying
// MultivaluedAttribute WeakAttribute

// IsA
// IsA Structure


// display: inline-block
// width: 34px; height: 32px;
// padding: 1px;
// overflow hidden

//
export default DragBarManager;