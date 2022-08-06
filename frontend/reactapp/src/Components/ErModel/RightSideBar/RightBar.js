import React from 'react';
import '../../DatabaseModellingStyle.css';
import {ConnectionCardinality, OBJECTTYPE} from "../../../Services/DrawBoardModel/ActionState";
import {ERTYPE, ERTYPECATEGORY} from "../../../Services/DrawBoardModel/ErType";
import {Footer, Header} from "./ObjectView";
import {resolveObjectById} from "../../../Services/Common/ObjectUtil";
import {ConnectionType} from "../../../Services/DrawBoardModel/Diagram";
import EnhancedSettings from "./EnhancedSettings";

const RightBar = ({selectedObjectId, connections, removeElement, setDisplayName, editConnectionNotation, drawBoardElements, toAddConnectionState, setOwningSideProperty}) => {

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
            connection.start === selectedObject.id)
            .sort((a,b) => {
                return a.id<b.id?-1:1
            });

    }

    function filterAndSortParentConnections(){
        return filterAndSortConnections().filter(connection => connection.connectionType === ConnectionType.parent);
    }

    function filterAndSortInheritorConnections(){
        return filterAndSortConnections().filter(connection => connection.connectionType === ConnectionType.inheritor);
    }

    function filterAndSortNonAttributeConnections(){
        return filterAndSortConnections().filter(connection => connection.connectionType !== ConnectionType.attributeConnector);
    }



    const RelationMenu = () => {
        return (

            <React.Fragment>

                {filterAndSortNonAttributeConnections().length > 0 ? <div>Associated to:</div> : <div>No associations</div> }

                {filterAndSortNonAttributeConnections().map((connection,i) => (
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
                <EnhancedSettings selectedObject={selectedObject}
                                  drawBoardElements={drawBoardElements}
                                  connections={connections}
                                  setOwningSideProperty={setOwningSideProperty}
                />
            </React.Fragment>

        )
    }


  const AssociationMenu = () => {
        let start = resolveObjectById(selectedObject.start, drawBoardElements)
        let end = resolveObjectById(selectedObject.end, drawBoardElements)

        let cardinality =
            <React.Fragment>
                <div>Cardinality</div>
                <div className={"spacerSmall"}/>
                <div>Min: {selectedObject.min} Max: {selectedObject.max} </div>
            </React.Fragment>

      if(selectedObject.connectionType === ConnectionType.attributeConnector)
          cardinality = null;

    return (

      <React.Fragment>

          <div className={"spacerBig"}/>

          {cardinality}

          <div className={"spacerBig"}/>

          <div>Connected between:</div>
          <div className={"spacerSmall"}/>
          <div>{start.displayName}</div>
          <div>{end.displayName}</div>

      </React.Fragment>

    )
  }

    const EntityMenu = () => {
        return null
    }

    const AttributeMenu = () => {
        return null
    }


    const IsAMenu = () => {

        const parents = filterAndSortParentConnections();
        const inheritors = filterAndSortInheritorConnections();

        return (

            <React.Fragment>

                <div className={"spacerBig"}/>
                {parents.length > 0 ? <div>Parent</div>: <div>No parent</div> }

                <div className={"spacerSmall"}/>

                {parents.map((connection,i) => (
                    <div key={connection.id + " -- " + i}>
                        {getDisplayNameAndType(connection)} <br/>
                    </div>
                ))}

                <div className={"spacerBig"}/>

                {inheritors.length > 0 ? <div>Inheritors:</div>: <div>No inheritors</div> }

                <div className={"spacerSmall"}/>

                {inheritors.map((connection,i) => (
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

        <div className={"spacerBig"}/>
        <Header selectedObjectId={selectedObjectId}
                setDisplayName={setDisplayName}
                drawBoardElements={drawBoardElements}
                connections={connections}/>

        {getDisplayMenu()}

        <div className={"spacerBig"}/>
        <Footer selectedObjectId={selectedObjectId}
                removeElement={removeElement}
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
