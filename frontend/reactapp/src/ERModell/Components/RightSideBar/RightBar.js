import React from 'react';
import '../../Playground.css';
import {ACTIONSTATE, ConnectionCardinality, OBJECTTYPE} from "../../ActionState";
import {ERTYPE, ERTYPECATEGORY} from "../../ErType";

const RightBar = ({selectedObject, connections, removeDrawBoardElement, removeConnection, setDisplayName, editConnectionNotation, setActionState, actionState, drawBoardElements}) => {

  const EntityMenu = () => {
    return (

      <React.Fragment>

        <h1>{ERTYPE[selectedObject.erType].toolTipTitle}: {selectedObject.displayName}</h1>
        <p> Name: <input type="text" onChange={(e) => setDisplayName(selectedObject.id, e.target.value)}/> </p>

        <button onClick={e => setActionState(ACTIONSTATE.AddConnection)}>Add Association</button>

        <br/><br/>

        <button onClick={e => removeDrawBoardElement(selectedObject.id)}>Delete {selectedObject.erType}</button>
      </React.Fragment>

    )
  }


    function getDisplayNameAndType(connection){

      let otherObjectId;

      if(connection.start === selectedObject.id) otherObjectId = connection.end;
      else otherObjectId = connection.start

      let otherObject = drawBoardElements.find(element => element.id === otherObjectId)

      return {
            displayName: otherObject.displayName,
            type: otherObject.erType
        }

    }


    const RelationMenu = () => {
        return (

            <React.Fragment>

                <h1>{ERTYPE[selectedObject.erType].toolTipTitle}: {selectedObject.displayName}</h1>
                <p> Name: <input type="text" onChange={(e) => setDisplayName(selectedObject.id, e.target.value)}/> </p>

                <p>Associated to:</p>

                {connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id).map(connection => (
                    <div>
                        {getDisplayNameAndType().type} : {getDisplayNameAndType().displayName} <br/>
                        Min: <input
                                defaultValue={connection.min}
                                onChange={e => editConnectionNotation(connection.id, ConnectionCardinality.Min, e.target.value)}/>
                        Max: <input
                                defaultValue={connection.max}
                                onChange={e => editConnectionNotation(connection.id, ConnectionCardinality.Max, e.target.value)}/>
                    </div>
                ))}

                <button onClick={e => setActionState(ACTIONSTATE.AddConnection)}>Add Association</button>

                <br/><br/>

                <button onClick={e => removeDrawBoardElement(selectedObject.id)}>Delete {selectedObject.erType}</button>
            </React.Fragment>

        )
    }


  const AssociationMenu = () => {
    return (

      <React.Fragment>

        <h1>Association</h1>
        
        <p>Cardinality</p>
        <p>Min: {selectedObject.min} Max: {selectedObject.max} </p>
        
        <br/><br/>
        <button onClick={removeConnection(selectedObject)}>Remove Association</button>

   {/*
        <p>Appearence</p>


        <select name="Darstellung" id="cars">
	        <option value="Direkt">Direkt</option>
          <option value="Gitter">Gitter</option>
          <option value="Geschwungen">Geschwungen</option>
        </select>

        <p>Pfeilausrichtung:</p>
        <div> 
          <p>Von</p>
          <select name="Ausrichtung" id="cars">
            <option value="Auto">Automatisch</option>
	          <option value="Links">Links</option>
            <option value="Rechts">Rechts</option>
            <option value="Oben">Oben</option>
            <option value="Unten">Unten</option>
          </select>
        </div>

        <div> 
          <p>Nach</p>
          <select name="Ausrichtung" id="cars">
            <option value="Auto">Automatisch</option>
	          <option value="Links">Links</option>
            <option value="Rechts">Rechts</option>
            <option value="Oben">Oben</option>
            <option value="Unten">Unten</option>
          </select>
        </div>
        */}
      </React.Fragment>

    )
  }

    const AttributeMenu = () => {
        return (

            <React.Fragment>

                <h1>{ERTYPE[selectedObject.erType].toolTipTitle}: {selectedObject.displayName}</h1>
                <p> Name: <input type="text" onChange={(e) => setDisplayName(selectedObject.id, e.target.value)}/> </p>

                <button onClick={e => setActionState(ACTIONSTATE.AddConnection)}>Add Association</button>

                <br/><br/>

                <button onClick={e => removeDrawBoardElement(selectedObject.id)}>Delete {selectedObject.erType}</button>
            </React.Fragment>

        )
    }

    //TODO überlegen ob der graph gerichtet wird oder ein zusätzliches property eingefügt wird
    const IsAMenu = () => {
        return (

            <React.Fragment>

                <h1>{ERTYPE[selectedObject.erType].toolTipTitle}: {selectedObject.displayName}</h1>


                <p>Inheritors to:</p>

                {connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id).map(connection => (
                    <div>
                        {getDisplayNameAndType().type} : {getDisplayNameAndType().displayName} <br/>
                    </div>
                ))}


                <p>Parent:</p>

                {connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id).map(connection => (
                    <div>
                        {getDisplayNameAndType().type} : {getDisplayNameAndType().displayName} <br/>
                    </div>
                ))}

                <button onClick={e => setActionState(ACTIONSTATE.AddConnection)}>Add Association</button>

                <br/><br/>

                <button onClick={e => removeDrawBoardElement(selectedObject.id)}>Delete {selectedObject.erType}</button>
            </React.Fragment>

        )
    }



    const getDisplayMenu = () => {

      if(selectedObject == null) return;

      if(selectedObject.objectType === OBJECTTYPE.Connection) return AssociationMenu();

      let category = ERTYPE[selectedObject.erType].category;
      let displayMenu = null;

      // eslint-disable-next-line default-case
      switch (category){
          case ERTYPECATEGORY.Relation:     displayMenu = RelationMenu();   break;
          case ERTYPECATEGORY.Entity:       displayMenu = EntityMenu();     break;
          case ERTYPECATEGORY.Attribute:    displayMenu = AttributeMenu();  break;
          case ERTYPECATEGORY.IsAStructure: displayMenu = IsAMenu();        break;
      }

      return displayMenu;
    }


  return (
    <div
      className="rightSidebarContainer"
      style={{ visibility: selectedObject === null ? 'hidden' : 'visible' }}
      onClick={(e) => e.stopPropagation()}>

      {getDisplayMenu()}

    </div>
  );
};

export default RightBar;
