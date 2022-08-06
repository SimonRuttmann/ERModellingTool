import React from 'react';
import '../../DatabaseModellingStyle.css';
import {ACTIONSTATE, OBJECTTYPE} from "../../../Services/DrawBoardModel/ActionState";
import {ERTYPE} from "../../../Services/DrawBoardModel/ErType";
import {resolveObjectById} from "../../../Services/Common/ObjectUtil";
import {ConnectionType} from "../../../Services/DrawBoardModel/Diagram";


//We hold here the selected object ! when we change anything this will still be the "old" object, the new object is a clone of this one
//In zukunft arbeiten wir hier deshalb wieder nur mit der selectedId anstatt dem object
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
                <input  type="text" className="rightBarInput" id="rightBarInputField"
                        onChange={(e) => { setDisplayName(selectedObject.id, e.target.value)}}
                        value={selectedObject.displayName}/></div>
            <hr className="spacer"/>
        </React.Fragment>
    )
}

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

//bad setState
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
