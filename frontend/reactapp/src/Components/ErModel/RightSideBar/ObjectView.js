import React from 'react';
import '../../DatabaseModellingStyle.css';
import {OBJECTTYPE} from "../../../Services/DrawBoardModel/ActionState";
import {ERTYPE} from "../../../Services/DrawBoardModel/ErType";
import {resolveObjectById} from "../../../Services/Common/ObjectUtil";
import {ConnectionType} from "../../../Services/DrawBoardModel/Diagram";
import DisplayConfiguration from "../../../Services/Configurations/DisplayConfiguration";


/**
 * The header part of the right sidebar, consisting of the name field and an input field to edit the name
 * @param selectedObjectId The currently selected object id
 * @param setDisplayName Function to set the display name
 * @param drawBoardElements The elements in the drawBoard
 * @param connections The connections in the drawBoard
 */
export const Header = ({selectedObjectId, setDisplayName, drawBoardElements, connections}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements, connections)
    if (selectedObject == null) return null;


    const isConnection = selectedObject.objectType === OBJECTTYPE.Connection
    const isIsAStructure = selectedObject.erType ? selectedObject.erType === ERTYPE.IsAStructure.name : false;

    if(isIsAStructure) {
        return (
            <div>{ERTYPE[selectedObject.erType].displayName}</div>
        )
    }


    if(isConnection) {
        return (
            <div>Association</div>
        )
    }


    return (
        <React.Fragment>
            {ERTYPE[selectedObject.erType].displayName}
            <div className={"spacerSmall"}/>
            <div className="rightBarCurrentName">{selectedObject.displayName}</div>
            <hr className="spacer"/>
            <div>
                <label htmlFor="rightBarInputField" className="rightBarInputFieldLabel">Name:</label>
                <input  type="text" className="rightBarInput" id="rightBarInputField" maxLength={DisplayConfiguration.maxLengthForElements}
                        onChange={(e) => { setDisplayName(selectedObject.id, e.target.value)}}
                        value={selectedObject.displayName}/></div>
            <hr className="spacer"/>
        </React.Fragment>
    )
}


/**
 * The footer part of the right sidebar, consisting of a addConnection button and delete button
 * @param selectedObjectId The currently selected object id
 * @param removeElement A function to remove an element
 * @param drawBoardElements The elements in the drawBoard
 * @param connections The connections in the drawBoard
 * @param toAddConnectionState A function executed to indicate that the user wants to add a connection
 */
export const Footer = ({selectedObjectId, removeElement, drawBoardElements, connections, toAddConnectionState}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements, connections)
    if (selectedObject == null) return null;

    if(selectedObject.objectType === OBJECTTYPE.Connection){
        return ( <FooterDelete removeElement={removeElement} selectedObject={selectedObject} />)
    }


    return (
        <React.Fragment>
            <FooterAddConnection toAddConnectionState={toAddConnectionState} selectedObject={selectedObject}/>
            <FooterDelete removeElement={removeElement} selectedObject={selectedObject}/>
        </React.Fragment>

    )
}

const FooterDelete = ({removeElement, selectedObject}) => {
    return(
        <button className="rightBarButton" onClick={() => removeElement(selectedObject.id)}>Delete</button>
    )
};


const FooterAddConnection = ({toAddConnectionState, selectedObject}) => {

    if(selectedObject.erType === ERTYPE.IsAStructure.name)
        return(
            <React.Fragment>
                <button className="rightBarButton" onClick={() => toAddConnectionState(selectedObject.id, ConnectionType.parent)}>Add Parent</button>
                <button className="rightBarButton" onClick={() => toAddConnectionState(selectedObject.id, ConnectionType.inheritor)}>Add Inheritor</button>
            </React.Fragment>
        )

    return(
        <button className="rightBarButton" onClick={() => toAddConnectionState(selectedObject.id, ConnectionType.association)}>Add Association</button>
    )
}
