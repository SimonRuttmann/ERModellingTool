import React from 'react';
import '../../DatabaseModellingStyle.css';
import {ConnectionCardinality, OBJECTTYPE} from "../../../Services/DrawBoardModel/ActionState";
import {ERTYPE, ERTYPECATEGORY} from "../../../Services/DrawBoardModel/ErType";
import {Footer, Header} from "./ObjectView";
import {resolveObjectById} from "../../../Services/Common/ObjectUtil";
import {ConnectionType} from "../../../Services/DrawBoardModel/Diagram";
import EnhancedSettings from "./EnhancedSettings";

/**
 * This component is responsible for rendering the hole right sidebar
 * Also executes provided functions at interaction with rendered elements
 *
 * @param selectedObjectId          The id of the currently selected object
 * @param connections               The connections on the drawBoard
 * @param removeElement             A function to remove an element
 * @param setDisplayName            A function to set the new display name
 * @param editConnectionNotation    A function to edit the cardinalities of a connection
 * @param drawBoardElements         The elements on the drawBoard
 * @param toAddConnectionState      A function executed to indicate, that the user wants to add a connection
 * @param setOwningSideProperty     A function to set the owningSideProperty for an element
 */
const RightBar = ({selectedObjectId, connections, removeElement, setDisplayName, editConnectionNotation, drawBoardElements, toAddConnectionState, setOwningSideProperty}) => {

    if(selectedObjectId == null) return null;

    let selectedObject = resolveObjectById(selectedObjectId, drawBoardElements, connections)
    if (selectedObject == null) return null;


    /**
     * Utils to display an element
     */

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

    /**
     * Sorting of connections, so they will always be displayed in the same order
     */

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

    /**
     * The following functions provide the main render content for a specific Er element
     * To the main content a footer and header will be added
     */


    /**
     * The main content displayed when a relation is selected
     */
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


    /**
     * The main content displayed when a connection is selected
     */
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

    /**
     * Entities and attributes only have a default footer and header a no additional content to display
     */

    const EntityMenu = () => {
        return null
    }

    const AttributeMenu = () => {
        return null
    }

    /**
     * The main content displayed when an isA is selected
     */
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

    /**
     * Selection of the main content
     */
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

    /**
     *  Rendering of the footer, main-content and header
     */

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