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
   * withArrow: false
   */
  const [connections, setConnections] = useState([]);


  //Adding the default display name based on this counter
  const [counter, setCounter] = useState(0);

  //The currently selected object id, or null
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  //The current ActionState, representing the current user action
  const [actionState, setActionState] = useState(ACTIONSTATE.Default);


  /**
   * Synchronize data with parent for download and transformation
   */
  useEffect( () => {

    syncErContent(drawBoardElements, connections);
  },[drawBoardElements, connections, syncErContent])


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

    const newElementState = unselectPreviousDrawBoardElement();
    setSelectedObjectId(null);

    setActionState(ACTIONSTATE.Default);

    setDrawBoardElements(() => [
        ...newElementState
    ])
  }


  const onDrawBoardElementSelected = (e, selectedElement) => {

    //click on draw board element
    let selectedObject = drawBoardElements.find(element => element.id === e.target.id)
    if( actionState === ACTIONSTATE.Default) {

      const unselectedElements = unselectPreviousDrawBoardElement();

      setSelectedObjectId(selectedObject.id);
      const updatedElements = selectElement(unselectedElements, e.target.id)

      setDrawBoardElements(() => [
        ...updatedElements
      ])
    }


    if( actionState === ACTIONSTATE.AddConnection) {

      const unselectedElements = unselectPreviousDrawBoardElement();
      //Selected Object ID is the previously selected element
      addConnection(selectedObjectId,e.target.id) //TODO von wo nach wo? vom bisher selectierten zum neu selektierten
      setSelectedObjectId(null);
      setActionState(ACTIONSTATE.Default)
      //setDrawBoardElementSelected(e.target.id)

      setDrawBoardElements(() => [
          ...unselectedElements
      ])

    }

  };


  const onConnectionSelected = (e, selectedElement) => {

    if( actionState === ACTIONSTATE.Default ||
        actionState === ACTIONSTATE.AddConnection) {

      //TODO 1. Unselected prev. Arrow object 2. set state object selected 3. Select this object e.target.id,
      const elements = unselectPreviousDrawBoardElement();
      setDrawBoardElements(() => [
          ...elements
      ])
      let connection = connections.find(connection => connection.id === e.target.id)
      setSelectedObjectId(connection.id);

      const updatedElements = selectElement(drawBoardElements, e.target.id)
      setDrawBoardElements(() => [
        ...updatedElements
      ])

    }

  };


  const addDrawBoardElement = (e) => {
    console.log("Add a new draw board element")

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

    console.log("remove")

    let selectedObject = resolveObjectById(id, drawBoardElements, connections)

    if(selectedObject.objectType === OBJECTTYPE.Connection) removeConnectionDirect(selectedObject)
    if(selectedObject.objectType === OBJECTTYPE.DrawBoardElement) removeDrawBoardElement(selectedObject.id)
    setSelectedObjectId(null)
  }

  const removeDrawBoardElement = (elementId) => {
    console.log("Removing draw board element with id: " + elementId)

    setConnections((prevState => [
        ...prevState.filter(connection => !(connection.start === elementId || connection.end === elementId))
    ]))


    setDrawBoardElements((prevState => [
        ...prevState.filter((element) => !(element.id === elementId))
    ]))

    setSelectedObjectId(null)

  }



  const addConnection = (idStart, idEnd) => {

    console.log("Creating a new connection from: " + idStart + " to " + idEnd)

    let newConnection =
        {
          id: `${idStart} --> ${idEnd} - ${Date.now()}`,
          start: idStart,
          end: idEnd,
          min: 1,
          max: 1,
          objectType: OBJECTTYPE.Connection,
          isSelected: false,
          withArrow: false,
        }

    setConnections((prevState) => [
      ...prevState,
      newConnection
    ])
  }

  const removeConnectionByObjectIds = (idStart, idEnd) => {
    console.log("Removing a connection from: " + idStart + " to " + idEnd)

    setConnections((prevState) => [
        ...prevState.filter((connection)=>!(connection.start === idStart && connection.end === idEnd))
    ])
  }

  const removeConnectionDirect = (connectionId) => {
    console.log("Removing a connection with id: " + connectionId)

    setConnections( (prevState => [
        ...prevState.filter((connection)=>!(connectionId === connection.id))
    ]))
  }



  const setConnectionSelected = (id, isSelected) => {

  }



  const unselectPreviousDrawBoardElement = () => {

    if(selectedObjectId == null) return drawBoardElements;

    return setDrawBoardElementNotSelectedNotHighlighted(selectedObjectId)


  }

  const setDrawBoardElementNotSelectedNotHighlighted = (id) => {

    return drawBoardElements.map(element => {
      if (element.id === id) return {...element, isSelected: false, isHighlighted: false}
      return {...element, isHighlighted: false}
    });

  }


  const selectElement = (elements, id) => {

    let selectedElement = elements.find(element => element.id === id)
    selectedElement.isSelected = true;

    let copy = Object.assign({},selectedElement)

    let notSelectedElements = elements.filter(element => !(element.id === id))

    return[
      copy,
      ...notSelectedElements
    ];

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


  const toAddConnectionState = (id) => {

    setActionState(ACTIONSTATE.AddConnection)
    let selectedObject = resolveObjectById(id, drawBoardElements, connections)
    //TODO Some logic regarding the selected object, what will be seletected etc

    let changedElements = drawBoardElements.map( (element) =>  {
        return {...element, isHighlighted: true};
    } )

    setDrawBoardElements(( () => [
      ...changedElements
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
    toAddConnectionState: toAddConnectionState,
    setActionState: setActionState,
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
