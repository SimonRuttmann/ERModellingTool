import React from 'react';
import '../../Playground.css';
import {ACTIONSTATE, ConnectionCardinality, OBJECTTYPE} from "../../ActionState";
import {ERTYPE, ERTYPECATEGORY} from "../../ErType";
import {Footer, Header} from "./ObjectView";
import {resolveObjectById} from "../../Util";

const RightBar = ({selectedObjectId, connections, removeElement, setDisplayName, editConnectionNotation, setActionState, actionState, drawBoardElements, toAddConnectionState}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements, connections)
    if (selectedObject == null) return null;


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

                <div>Associated to:</div>

                {connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id).map(connection => (
                    <div>
                        {getDisplayNameAndType(connection).type} : {getDisplayNameAndType(connection).displayName} <br/>
                        Min: <input
                                defaultValue={connection.min}
                                onChange={e => editConnectionNotation(connection.id, ConnectionCardinality.Min, e.target.value)}/>
                        Max: <input
                                defaultValue={connection.max}
                                onChange={e => editConnectionNotation(connection.id, ConnectionCardinality.Max, e.target.value)}/>
                    </div>
                ))}

            </React.Fragment>

        )
    }


  const AssociationMenu = () => {
    return (

      <React.Fragment>
        <div>Cardinality</div>
        <div>Min: {selectedObject.min} Max: {selectedObject.max} </div>
      </React.Fragment>

    )
  }

    const EntityMenu = () => {
        return null
    }

    const AttributeMenu = () => {
        return null
    }

    //TODO überlegen ob der graph gerichtet wird oder ein zusätzliches property eingefügt wird
    const IsAMenu = () => {
        return (

            <React.Fragment>

                <div>Inheritors to:</div>
                {connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id).map(connection => (
                    <div>
                        {getDisplayNameAndType(connection).type} : {getDisplayNameAndType(connection).displayName} <br/>
                    </div>
                ))}

                <p>Parent:</p>
                {connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id).map(connection => (
                    <div>
                        {getDisplayNameAndType(connection).type} : {getDisplayNameAndType(connection).displayName} <br/>
                    </div>
                ))}

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

  if(selectedObject == null) return null

  return (

    <div
      className="rightSidebarContainer"
      onClick={(e) => e.stopPropagation()}>


        <Header selectedObjectId={selectedObjectId}
                setDisplayName={setDisplayName}
                drawBoardElements={drawBoardElements}
                connections={connections}/>

        {getDisplayMenu()}

        <Footer selectedObjectId={selectedObjectId}
                removeElement={removeElement}
                setActionState={setActionState}
                drawBoardElements={drawBoardElements}
                connections={connections}
                toAddConnectionState={toAddConnectionState}/>


    </div>
  );
};

export default RightBar;




/*
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
        */
