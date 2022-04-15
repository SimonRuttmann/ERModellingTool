import React from "react";
import {erTypesEnum} from "./ErTypesEnum";
import ReactTooltip from "react-tooltip";
import ToolTip from "./Tooltip";

const DragBarManager = ({erTypes}) => {

    function resolveErType(erType){
        return erTypesEnum[erType];
    }

    function setDataTransfer(dragEvent, erType){
        return dragEvent.dataTransfer.setData('erType', erType)
    }

    console.log("Creating inside drag bar manager : " + erTypes)

    return (
                <React.Fragment>
                  {/* Container */}
                {erTypes.map((erType) => (
                    <div
                        className="leftSideBarElement"
                        key={erType+"_draggableContainer"}
                        data-tip={"Hallo" + erType}
                        data-for={erType+"toolTip"}
                        onDragStart={(e) => {setDataTransfer(e, erType)}}
                        >
                        <ReactTooltip id={erType+"toolTip"} effect="solid" place={"right"}><ToolTip erType={erType}/></ReactTooltip>
                        {resolveErType(erType)}
                    </div>
                ))}

                {/*
            <ReactTooltip id="NormalAttribute" effect="solid" place={"right"}/>
            <ReactTooltip id="IdentifyingAttribute" effect="solid" place={"right"}/>
            <ReactTooltip id="StrongEntity" effect="solid" place={"right"}><p>Hallo Starke ENtittäte</p></ReactTooltip>
*/}
                </React.Fragment>

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