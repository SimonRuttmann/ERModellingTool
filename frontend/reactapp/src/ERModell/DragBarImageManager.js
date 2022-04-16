import React from "react";
import {ERTYPE} from "./ErTypesEnum";
import ReactTooltip from "react-tooltip";
import ToolTip from "./Tooltip";

const DragBarManager = ({erTypes}) => {

    function resolveErType(erType){
        return ERTYPE[erType].icon;
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

                </React.Fragment>

    )
}

export default DragBarManager;