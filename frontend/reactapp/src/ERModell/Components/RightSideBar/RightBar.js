import React from 'react';
import '../../Playground.css';
import {ConnectionCardinality, OBJECTTYPE} from "../../Model/ActionState";
import {ERTYPE, ERTYPECATEGORY} from "../../Model/ErType";
import {Footer, Header} from "./ObjectView";
import {resolveObjectById} from "../Util/ObjectUtil";

const RightBar = ({selectedObjectId, connections, removeElement, setDisplayName, editConnectionNotation, setActionState, drawBoardElements, toAddConnectionState}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements, connections)
    if (selectedObject == null) return null;


    function getDisplayNameAndType(connection){

      let otherObjectId;

      if(connection.start === selectedObject.id) otherObjectId = connection.end;
      else otherObjectId = connection.start

      let otherObject = drawBoardElements.find(element => element.id === otherObjectId)

      let erTypeDisplayName = ERTYPE[otherObject.erType].displayName;
      let displayName = erTypeDisplayName + ": " + otherObject.displayName


      if(otherObject.erType === ERTYPE.IsAStructure.name){
          displayName = erTypeDisplayName;
      }

      return displayName

    }

    function filterAndSortConnections(){
        return connections.filter(connection =>
            connection.end === selectedObject.id ||
            connection.start === selectedObject.id).
            sort((a,b) => {
                return a.id<b.id?-1:1
            });

    }

    const RelationMenu = () => {
        return (

            <React.Fragment>

                {filterAndSortConnections().length > 0 ? <div>Associated to:</div> : <div>No associations</div> }

                {filterAndSortConnections().map((connection,i) => (
                    <div key={connection.id + " -- " + i}>
                        {getDisplayNameAndType(connection)} <br/>
                        Min: <input
                                className="rightBarCardinality"
                                defaultValue={connection.min}
                                maxLength={2}
                                onChange={e => editConnectionNotation(connection.id, ConnectionCardinality.Min, e.target.value)}/>
                        Max: <input
                                className="rightBarCardinality"
                                defaultValue={connection.max}
                                maxLength={2}
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


                {filterAndSortConnections().length > 0 ? <div>Inheritors to:</div>: <div>No inheritors</div> }

                {filterAndSortConnections().map((connection,i) => (
                    <div key={connection.id + " -- " + i}>
                        {getDisplayNameAndType(connection)} <br/>
                    </div>
                ))}

                {filterAndSortConnections().length > 0 ? <div>Parent</div>: <div>No parent</div> }

                {filterAndSortConnections().map((connection,i) => (
                    <div key={connection.id + " -- " + i}>
                        {getDisplayNameAndType(connection)} <br/>
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
