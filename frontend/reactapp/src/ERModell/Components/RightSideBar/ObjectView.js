import React from 'react';
import '../../Playground.css';
import {ACTIONSTATE, OBJECTTYPE} from "../../ActionState";
import {ERTYPE} from "../../ErType";

export const Header = ({selectedObject, setDisplayName}) => {

    const isConnection = selectedObject.type === OBJECTTYPE.Connection
    const isIsAStructure = selectedObject.erType ? selectedObject.erType === ERTYPE.IsAStructure : false;

    if(isIsAStructure) {
        return (
            <div>{ERTYPE[selectedObject.erType].toolTipTitle}</div>
        )
    }

    if(isConnection) {
        return (
            <div>Association</div>
        )
    }

    return (
        <React.Fragment>
            {ERTYPE[selectedObject.erType].toolTipTitle}
            <div>{selectedObject.displayName}</div>
            <div> Name: <input type="text" onChange={(e) => setDisplayName(selectedObject.id, e.target.value)}/></div>
        </React.Fragment>
    )
}

export const Footer = ({selectedObject, removeElement, setActionState}) => {

    if(selectedObject.objectType === OBJECTTYPE.Connection){
        return ( <FooterDelete removeElement={removeElement} />)
    }

    return (

        <React.Fragment>
            <FooterAddConnection setActionState={setActionState}/>
            <FooterDelete removeElement={removeElement}/>
        </React.Fragment>

    )
}

const FooterDelete = ({removeElement}) => {
    return(
        <button onClick={(e) => removeElement}>Delete</button>
    )
};

//bad setState
const FooterAddConnection = ({setActionState}) => {
    return(
        <button onClick={(e) => setActionState(ACTIONSTATE.AddConnection)}>Add Association</button>
    )
}
