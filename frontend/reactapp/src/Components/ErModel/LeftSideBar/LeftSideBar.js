import DragBarManager from "./DragBarImageManager";
import {ERTYPECATEGORY, returnNamesOfCategory} from "../../../Services/DrawBoardModel/ErType";
import React from "react";

/**
 * Renders the hole left side bare by orchestrating DragBarManagers for all ErTypes
 * @see DragBarManager
 */
const LeftSideBar = () => {

    return (

        <div className="leftSidebarContainer">

            <div className="leftSidebarSelectionContainer">

                <div className="leftSidebarMainTitle">ER-Elements</div>
                <hr className="sidebarDivider"/>

                <div className="leftSidebarTitle">Attributes</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.Attribute)}/>
                <hr className="sidebarDivider"/>

                <div className="leftSidebarTitle">Entities</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.Entity)}/>
                <hr className="sidebarDivider"/>

                <div className="leftSidebarTitle">Relations</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.Relation)}/>
                <hr className="sidebarDivider"/>

                <div className="leftSidebarTitle">IsA Structure</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.IsAStructure)}/>
                <hr className="sidebarDivider"/>
            </div>
        </div>

    )
}
export default LeftSideBar;