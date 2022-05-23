import React, {useEffect, useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import RightBar from './Components/RightSideBar/RightBar';
import ConnectionElement from './Components/DrawBoard/ConnectionElement';
import {ERTYPE} from './Model/ErType';
import {ACTIONSTATE, ConnectionCardinality, OBJECTTYPE} from "./Model/ActionState";
import {resolveObjectById} from "./Components/Util/ObjectUtil";
import LeftSideBar from "./Components/LeftSideBar/LeftSideBar";
import DrawBoard from "./Components/DrawBoard/DrawBoard";
import TransformButton from "./TransformButton";
import {ConnectionType} from "./Model/Diagram";
import {createConnection} from "./ConnectionCreationRules";
import {createSelection} from "./ErRules/ErDrawingRuleEnforcer";
import {validateErDiagram} from "./ErRules/ErValidator";

const PlayGround = ({syncErContent, importedContent, triggerImportComplete, transformToRel}) => {


  /**
   * Schema for drawBoardElements
   * id: newId,
   * displayName: "new "+ erType + " " + counter,
   * isHighlighted: false,
   * isSelected: false,
   * x: e.clientX - x - 50,
   * y: e.clientY - y - 50,
   * width: 150,
   * height: 100,
   * objectType: OBJECTTYPE.DrawBoardElement,
   * erType: erType
   */
  const [drawBoardElements, setDrawBoardElements] = useState([]);
  
  /**
   * Schema for connections
   * id: `${idStart} --> ${idEnd} - ${Date.now()}`,
   * start: idStart,
   * end: idEnd,
   * min: 1,
   * max: 1,
   * objectType: OBJECTTYPE.Connection,
   * isSelected: false,
   * withArrow: false,
   * withLabel: true,
   */
  const [connections, setConnections] = useState([]);


  //Adding the default display name based on this counter
  const [counter, setCounter] = useState(0);

  //The currently selected object id, or null
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  //The current ActionState, representing the current user action
  const [actionState, setActionState] = useState(ACTIONSTATE.Default);
  //This state only indicate which kind of connection should be added
  const [connectionInformation, addConnectionInformation] = useState(ConnectionType.association)

  /**
   * Method to change the current ActionState
   *
   * @param state The state to change to
   * @param connectionType Optional definition of connection type to add
   *
   * @see ACTIONSTATE
   * @see ConnectionType
   */
  const changeActionState = (state, connectionType) => {

    if(state == null) return;
    if(connectionType == null) connectionType = ConnectionType.association;

    setActionState(state);
    addConnectionInformation(connectionType);

  }

  /**
   * Synchronize data with parent for download and transformation
   */
  useEffect( () => {

    syncErContent(drawBoardElements, connections);
  },[drawBoardElements, connections, syncErContent])


  const [invalidMessages, setInvalidMessages] = useState([])

  console.log(invalidMessages);
  useEffect( () => {

    //--> Then button enable, else button disable
    const errorMessages = validateErDiagram(connections, drawBoardElements)

    setInvalidMessages([...errorMessages])


    //TODO
    //Connections and DrawBoardElements are not empty
    //For every attribute -> Root != null
    //For every Entity -> Key (top level)
    //For every Relation -> >= 2 connections to entity category
    //For every ISa Parent + Inheritor is present
    //Every weak entity identified

    //--> Then button enable, else button disable



  },[drawBoardElements, connections])


  /**
   * Import functionality
   */
  useEffect( () => {

    if(importedContent == null) return;

    if(importedContent.drawBoardContent != null){

       if(Array.isArray(importedContent.drawBoardContent.connections)) {
         setConnections(() => [
           ...importedContent.drawBoardContent.connections
         ])
       }

      if(Array.isArray(importedContent.drawBoardContent.elements)) {

        setDrawBoardElements(() => [
          ...importedContent.drawBoardContent.elements
        ])
      }

      triggerImportComplete()
    }

  },[importedContent, triggerImportComplete])


  const onCanvasSelected = () => {

    if(selectedObjectId == null) return;

    const newElementState = unselectPreviousElement();
    setSelectedObjectId(null);

    changeActionState(ACTIONSTATE.Default);

    setElementState(newElementState.type, newElementState.elements)

  }

  const setElementState = (type, elements) => {

    if (type === OBJECTTYPE.Connection)
      setConnections( () => [
          ...elements
      ])

    if(type === OBJECTTYPE.DrawBoardElement)
      setDrawBoardElements(() => [
          ...elements
      ])

  }

  const onDrawBoardElementSelected = (drawBoardElementId) => {

    //click on draw board element
    let selectedObject = drawBoardElements.find(element => element.id === drawBoardElementId);

    if(selectedObject == null) return;


    if( actionState === ACTIONSTATE.Default) {

      if(selectedObjectId == null){

        const updatedElements = selectElement(drawBoardElements, drawBoardElementId)

        setElementState(OBJECTTYPE.DrawBoardElement, updatedElements)

        setSelectedObjectId(selectedObject.id);

      }
      else{

        const unselectedElements = unselectPreviousElement();

        if(unselectedElements.type === OBJECTTYPE.Connection){
          setElementState(OBJECTTYPE.Connection, unselectedElements.elements)

          const updatedElements = selectElement(drawBoardElements, drawBoardElementId)
          setElementState(OBJECTTYPE.DrawBoardElement, updatedElements)
        }

        if(unselectedElements.type === OBJECTTYPE.DrawBoardElement){

          const updatedElements = selectElement(unselectedElements.elements, drawBoardElementId)
          setElementState(OBJECTTYPE.DrawBoardElement, updatedElements)

        }


        setSelectedObjectId(selectedObject.id);
      }



    }


    if( actionState === ACTIONSTATE.AddConnection) {

      changeActionState(ACTIONSTATE.Default)

      let previousSelectedObject = selectedObjectId;
      setSelectedObjectId(null);

      const unselectedElements = unselectPreviousElement();

      if(unselectedElements.type === OBJECTTYPE.Connection) return;

      //Selected Object ID is the previously selected element
      addConnection(previousSelectedObject,drawBoardElementId, connectionInformation)

      setDrawBoardElements(() => [
          ...unselectedElements.elements
      ])

    }

  };


  const onConnectionSelected = (connectionId) => {


    if( actionState === ACTIONSTATE.Default ||
        actionState === ACTIONSTATE.AddConnection) {

      let connection = connections.find(connection => connection.id === connectionId)
      setSelectedObjectId(connection.id);


      if(selectedObjectId == null){

        const updatedConnections = selectElement(connections, connectionId)
        setConnections(() => [
          ...updatedConnections
        ])

        return;
      }


      const unselectedElements = unselectPreviousElement();

      if(unselectedElements.type === OBJECTTYPE.Connection) {

        const updatedConnections = selectElement(unselectedElements.elements, connectionId)
        setConnections(() => [
          ...updatedConnections
        ])

        return;
      }



      if(unselectedElements.type === OBJECTTYPE.DrawBoardElement){
        setElementState(OBJECTTYPE.DrawBoardElement, unselectedElements.elements)

        const updatedConnections = selectElement(connections, connectionId)
        setConnections(() => [
          ...updatedConnections
        ])


      }

    }

  };



  const addDrawBoardElement = (e) => {

    let erType = e.dataTransfer.getData('erType');

    if (Object.keys(ERTYPE).includes(erType)){

      let newId = erType + "--" + Date.now();
      let { x, y } = e.target.getBoundingClientRect();

      let newDrawBoardElement = {
        id: newId,
        displayName: "new "+ erType + " " + counter,
        isHighlighted: false,
        isSelected: false,
        x: e.clientX - x - 50,
        y: e.clientY - y - 50,
        width: 150,
        height: 100,
        objectType: OBJECTTYPE.DrawBoardElement,
        erType: erType
      };

      setDrawBoardElements([
          ...drawBoardElements,
        newDrawBoardElement]);

      setCounter(counter+1);


    }


  };


  /**
   * Function given to DrawBoardElement to update the position in the state
   * @param elementId The id of the element
   * @param x The x coordinate of the element
   * @param y The y coordinate of the element
   * @see DrawBoardElement
   */
  const updateDrawBoardElementPosition = (elementId, x, y) => {

    let element = drawBoardElements.find(element => element.id === elementId)

    let otherElements = drawBoardElements.filter(element => !(element.id === elementId))

    let clone = Object.assign({}, element)
    clone.x = x;
    clone.y = y;

    setDrawBoardElements( ()=> [
      ...otherElements,
      clone
    ])


  }


  /**
   * Function given to the concrete implementations of DrawBoardElement to update the size in the state
   * @param elementId The id of the element
   * @param width The width of the element
   * @param height The height of the element
   * @see DrawBoardElement
   * @see resolveErComponent
   */
  const updateDrawBoardElementSize = (elementId, width, height) => {

    let element = drawBoardElements.find(element => element.id === elementId)

    let otherElements = drawBoardElements.filter(element => !(element.id === elementId))

    let clone = Object.assign({}, element)
    clone.width = width;
    clone.height = height;

    setDrawBoardElements( ()=> [
      ...otherElements,
      clone
    ])

  }

  const removeElement = (id) => {



    let selectedObject = resolveObjectById(id, drawBoardElements, connections)

    if(selectedObject.objectType === OBJECTTYPE.Connection) removeConnectionDirect(selectedObject)
    if(selectedObject.objectType === OBJECTTYPE.DrawBoardElement) removeDrawBoardElement(selectedObject.id)
    setSelectedObjectId(null)
  }

  const removeDrawBoardElement = (elementId) => {

    setConnections((prevState => [
        ...prevState.filter(connection => !(connection.start === elementId || connection.end === elementId))
    ]))


    setDrawBoardElements((prevState => [
        ...prevState.filter((element) => !(element.id === elementId))
    ]))

    setSelectedObjectId(null)

  }



  const addConnection = (idStart, idEnd, connectionInformation) => {

    let newConnection = createConnection(drawBoardElements, idStart, idEnd, connectionInformation);

    setConnections((prevState) => [
      ...prevState,
      newConnection
    ])
  }


  const removeConnectionDirect = (connectionToRemove) => {

    setConnections( (prevState => [
        ...prevState.filter((connection)=>!(connectionToRemove.id === connection.id))
    ]))
  }


  const unselectPreviousElement = () => {

    let selectedObject = resolveObjectById(selectedObjectId, connections, drawBoardElements);

    if(selectedObject.objectType === OBJECTTYPE.Connection)
      return { type: OBJECTTYPE.Connection,
               elements: setElementNotSelectedNotHighlighted(selectedObjectId, connections)}
    else
      return { type: OBJECTTYPE.DrawBoardElement,
               elements: setElementNotSelectedNotHighlighted(selectedObjectId, drawBoardElements)}

  }

  const setElementNotSelectedNotHighlighted = (id, elements) => {

    return elements.map(element => {
      if (element.id === id) return {...element, isSelected: false, isHighlighted: false}
      return {...element, isHighlighted: false}
    });

  }


  const selectElement = (elements, id) => {

    let shallowCopy = [...elements];
    let selectedElement = shallowCopy.find(element => element.id === id)
    selectedElement.isSelected = true;

    return[...shallowCopy];

  }

  const setDisplayName = (elementId, value) => {

    let changedElements = drawBoardElements.map( (element) =>  {
      if(element.id === elementId)
        return {...element, displayName: value};
        return element;
    } )


    setDrawBoardElements(( () => [
      ...changedElements
    ]))

  }

  const editConnectionNotation = (connectionId, minMax, notation) => {

    let changedConnection = connections.find(connection => connection.id === connectionId)

    if(minMax === ConnectionCardinality.Min) changedConnection.min = notation;
    if(minMax === ConnectionCardinality.Max) changedConnection.max = notation;

    let clone = Object.assign({}, changedConnection)
    setConnections(( () => [
        ...connections.filter(connection => !(connection.id === connectionId)),
        clone
    ]))

  }



  const toAddConnectionState = (id, type) => {

    changeActionState(ACTIONSTATE.AddConnection, type)

    const selectionElements = createSelection(id, type, drawBoardElements, connections)

    setDrawBoardElements(( () => [
      ...selectionElements
    ]))

  }

  /**
   * All properties, which will be passed to the right bar
   * to perform modifying actions on the diagram
   */
  const rightBarProps = {
    selectedObjectId: selectedObjectId,
    connections: connections,
    drawBoardElements: drawBoardElements,
    removeElement: removeElement,
    setDisplayName: setDisplayName,
    editConnectionNotation: editConnectionNotation,
    toAddConnectionState: toAddConnectionState
  }


  /**
   * The offset between the canvas and the inner drawBoard
   * The "border" of the background page is set to 30 px offset to the mostOuter and therefore canvas
   */
  const drawBoardBorderOffset = 30;

  return (

    <div>
        <div className="canvasStyle" id="canvas" onClick={() => onCanvasSelected(null)}>
          {/* The left toolbar, containing the elements to drag into the draw board  */}
          <LeftSideBar/>

          {/* The draw board   */}
          <DrawBoard onDropHandler={addDrawBoardElement} drawBoardElements={drawBoardElements} drawBoardBorderOffset={drawBoardBorderOffset}>

            {/* The elements inside the draw board */}
            {drawBoardElements.map((drawBoardElement) => (
                <DrawBoardElement  key={drawBoardElement.id}

                                   onDrawBoardElementSelected={onDrawBoardElementSelected}
                                   updateDrawBoardElementPosition={updateDrawBoardElementPosition}

                                   thisObject={drawBoardElement}
                                   updateDrawBoardElementSize = {updateDrawBoardElementSize}

                                   svgBounds={drawBoardBorderOffset}
                />
            ))}


            {/* The connections of the elements inside the draw board */}
            {connections.map((connection, i) => (
                <ConnectionElement
                    key={connection.id + " -- " + i}

                    connections={connections}
                    thisConnection={connection}
                    onConnectionSelected={onConnectionSelected}

                />
            ))}

          </DrawBoard>

          {/* The right bar, used for editing the elements in the draw board */}
          <RightBar {...rightBarProps} />
          <TransformButton transformToRel={transformToRel}/>
        </div>
    </div>
  );
};
export default PlayGround;
