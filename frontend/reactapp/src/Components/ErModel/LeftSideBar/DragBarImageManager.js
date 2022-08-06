import React from "react";
import {ERTYPE} from "../../../Services/DrawBoardModel/ErType";
import ReactTooltip from "react-tooltip";
import ToolTip from "./Tooltip";

/**
 * Component to render one draggable component for each given erType on the left sidebar
 * Also registers an onDragStart event and registers the erType to it
 * @param erTypes The types to display on the left sidebar
 */
const DragBarManager = ({erTypes}) => {

    function resolveErType(erType){
        return ERTYPE[erType].icon;
    }

    function setDataTransfer(dragEvent, erType){
        return dragEvent.dataTransfer.setData('erType', erType)
    }

    return (
            <React.Fragment>

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