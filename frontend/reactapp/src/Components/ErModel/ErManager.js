import React, {useEffect, useState} from 'react';
import '../DatabaseModellingStyle.css';
import DrawBoardElement from '../DrawingBoard/DrawBoardElement';
import RightBar from './RightSideBar/RightBar';
import ConnectionElement from '../DrawingBoard/ConnectionElement';
import {ERTYPE} from '../../Services/DrawBoardModel/ErType';
import {ACTIONSTATE, OBJECTTYPE} from "../../Services/DrawBoardModel/ActionState";
import {resolveObjectById} from "../../Services/Common/ObjectUtil";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import DrawBoard from "../DrawingBoard/DrawBoard";
import TransformButton from "./TransformButton";
import {ConnectionType, DiagramTypes} from "../../Services/DrawBoardModel/Diagram";
import ErConnectionCreator from "../../Services/ErConnectionCreation/ErConnectionCreator";
import ErPartialConsistencyValidation from "../../Services/ErRules/ErPartialConsistencyValidation";
import ErFeedbackSystem from "../../Services/ErRules/ErFeedbackSystem";
import {useSelector, useDispatch} from "react-redux";
import {
  AddConnection,
  AddDrawBoardElement,
  UpdateConnectionNotation,
  HighlightDrawBoardElements,
  RemoveConnection,
  RemoveDrawBoardElement,
  SelectAnyElement,
  selectErContentSlice,
  SetDrawBoardElementDisplayName,
  SetDrawBoardElementOwningSide,
  UnselectAndUnHighlightAllElements,
  UpdateDrawBoardElementPosition,
  UpdateDrawBoardElementSize
} from "../../ReduxStore/ErContentSlice";

/**
 * Responsible for rendering the hole Er diagram
 * Also contains the interaction logic and provides it to child components
 *
 * The state of all connections and elements in the diagrams are kept in the redux store
 *
 * @param transformToRel A function executed, when the user wants to transform the Er diagram into the relational diagram
 * @param importExecuted A flag to indicate if an import was executed
 * @param triggerImportComplete A function to reset the importExecuted flag
 * @see ErContentSlice
 */
const ErManager = ({transformToRel, importExecuted, triggerImportComplete}) => {

  const erContentStore = useSelector(selectErContentSlice);
  const erContentStoreAccess = useDispatch();

  //The currently selected object id, or null
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  //The current ActionState, representing the current user action
  const [actionState, setActionState] = useState(ACTIONSTATE.Default);

  //This state only indicate which kind of connection should be added
  const [connectionInformation, addConnectionInformation] = useState(ConnectionType.association)


  //Reset selected object id on import
  useEffect( () => {

    if(importExecuted) {
      setSelectedObjectId(null)
      triggerImportComplete()
    }

  },[importExecuted])

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
   * Integration of FeedbackSystem
   */
  const [invalidMessages, setInvalidMessages] = useState([])

  useEffect( () => {

    const errorMessages = ErFeedbackSystem.validateErDiagram(erContentStore.connections, erContentStore.drawBoardElements)

    setInvalidMessages([...errorMessages])

  },[erContentStore])


  /**
   * Click on the canvas
   * If elements on the draw board get clicked, this method won't be invoked
   */
  const onCanvasSelected = () => {

    if(selectedObjectId == null) return;

    erContentStoreAccess(UnselectAndUnHighlightAllElements())

    setSelectedObjectId(null);
    changeActionState(ACTIONSTATE.Default);

  }


  /**
   * Click on a draw board element
   * @param drawBoardElementId The id of the clicked element
   */
  const onDrawBoardElementSelected = (drawBoardElementId) => {

    let newSelectedObject = erContentStore.drawBoardElements.find(element => element.id === drawBoardElementId);
    let previousSelectedObjectId = selectedObjectId;
    let previousSelectedObject = resolveObjectById(previousSelectedObjectId, erContentStore.connections, erContentStore.drawBoardElements);

    if(newSelectedObject == null) return;

    if(actionState === ACTIONSTATE.Default) {

      if(previousSelectedObjectId != null) {
        erContentStoreAccess(UnselectAndUnHighlightAllElements())
      }

      erContentStoreAccess(SelectAnyElement({id: newSelectedObject.id}))
      setSelectedObjectId(newSelectedObject.id);
    }

    if( actionState === ACTIONSTATE.AddConnection) {

      //Only allow new connections on highlighted elements
      if(newSelectedObject.isHighlighted === false) return;

      //Restore default behaviour
      //Default actionState, unselect previous element, clear selected object id
      changeActionState(ACTIONSTATE.Default)
      setSelectedObjectId(null);
      erContentStoreAccess(UnselectAndUnHighlightAllElements())

      if(previousSelectedObject.objectType === OBJECTTYPE.Connection) return;

      //Add new connection
      let newConnection = ErConnectionCreator.createConnection(erContentStore.drawBoardElements, previousSelectedObjectId, drawBoardElementId, connectionInformation);
      erContentStoreAccess(AddConnection({newConnection: newConnection}))
    }

  };

  /**
   * Invoked by a click on a connection, selects this element and de-selects, de-highlights other elements
   * @param connectionId The id of the clicked connection
   */
  const onConnectionSelected = (connectionId) => {


    if( actionState === ACTIONSTATE.Default ||
        actionState === ACTIONSTATE.AddConnection) {

      let connection = erContentStore.connections.find(connection => connection.id === connectionId)
      setSelectedObjectId(connection.id);


      //If no element was previously selected, select the connection
      if(selectedObjectId == null){
        erContentStoreAccess(SelectAnyElement({id: connection.id}))
        return;
      }

      //There is an element selected, so unselect it and highlight the new connection
      erContentStoreAccess(UnselectAndUnHighlightAllElements())
      erContentStoreAccess(SelectAnyElement({id: connection.id}))
    }

  };


  /**
   * Executed when an element of the left sidebar gets dropped into the canvas
   * @param e An event containing information about the current position and the erType
   */
  const addDrawBoardElement = (e) => {

    let erType = e.dataTransfer.getData('erType');

    if (Object.keys(ERTYPE).includes(erType)){

      let newId = erType + "--" + Date.now();

      //The currentTarget needs to be used instead of the e.target, to always receive the
      //element which has the handler on the event installed
      //With e.target the target can be set to a sub element of the svg, when dropping over it
      //therefore the x and y coordinates would be relative to the sub element instead of the svg
      let { x, y } = e.currentTarget.getBoundingClientRect();

      let newDrawBoardElement = {
        id: newId,
        displayName: "new "+ erType + " " + erContentStore.drawBoardElements.length,
        isHighlighted: false,
        isSelected: false,
        x: e.clientX - x - 50,
        y: e.clientY - y - 50,
        width: 150,
        height: 100,
        objectType: OBJECTTYPE.DrawBoardElement,
        erType: erType,
        owningSide: null
      };

      erContentStoreAccess(AddDrawBoardElement({newElement: newDrawBoardElement}))

      e.stopPropagation();
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
    erContentStoreAccess(UpdateDrawBoardElementPosition({id: elementId, x: x, y: y}));
  }

  /**
   * Function given to the concrete implementations of DrawBoardElement to update the size in the state
   * @param elementId The id of the element
   * @param width The width of the element
   * @param height The height of the element
   * @see DrawBoardElement
   */
  const updateDrawBoardElementSize = (elementId, width, height) => {
    erContentStoreAccess(UpdateDrawBoardElementSize({id: elementId, width: width, height: height}));
  }

  /**
   * This function is invoked by the right sidebar
   * Removes a connection or draw board element and in case of a draw board element all connections to and from it
   * @param id The id of the element
   */
  const removeElement = (id) => {

    let objectToRemove = resolveObjectById(id, erContentStore.drawBoardElements, erContentStore.connections)

    if(objectToRemove.objectType === OBJECTTYPE.Connection) {
      erContentStoreAccess(RemoveConnection({id: objectToRemove.id}))
    }
    if(objectToRemove.objectType === OBJECTTYPE.DrawBoardElement){
      erContentStoreAccess(RemoveDrawBoardElement({id: objectToRemove.id}))
    }

    erContentStoreAccess(UnselectAndUnHighlightAllElements())
    setSelectedObjectId(null);
    changeActionState(ACTIONSTATE.Default);
  }

  /**
   * Sets the owning side property for an element
   * @see SetDrawBoardElementOwningSide
   */
  const setOwningSideProperty = (selectedRelationId, owningElementId) => {
    erContentStoreAccess(SetDrawBoardElementOwningSide({id: selectedRelationId, owningSide: owningElementId}))
  }

  /**
   * Sets the display name property for an element
   * @see SetDrawBoardElementDisplayName
   */
  const setDisplayName = (id, displayName) => {
    erContentStoreAccess(SetDrawBoardElementDisplayName({id: id, displayName: displayName}))
  }

  /**
   * Sets the min or max property for an element
   * @see UpdateConnectionNotation
   */
  const editConnectionNotation = (id, minMax, notation) => {
    erContentStoreAccess(UpdateConnectionNotation({id: id, notation: notation, minMax: minMax}));
  }

  /**
   * Changes the active state to the ActionState.AddConnection
   * In this state, the elements where a connection is possible will be highlighted
   * within the use of the validation system
   * @param id The id of the currently selected element
   * @param type Additional information about the connection type.
   *             This is required to differentiate between inheritor and parent connections of IsA Structures
   */
  const toAddConnectionState = (id, type) => {
    changeActionState(ACTIONSTATE.AddConnection, type)
    const highlightedIds = ErPartialConsistencyValidation.createSelection(id, type, erContentStore.drawBoardElements, erContentStore.connections)
    erContentStoreAccess(HighlightDrawBoardElements({idsToHighlight: highlightedIds}))
  }

  /**
   * All properties, which will be passed to the right bar
   * to perform modifying actions on the elements
   */
  const rightBarProps = {
    selectedObjectId: selectedObjectId,
    connections: erContentStore.connections,
    drawBoardElements: erContentStore.drawBoardElements,
    removeElement: removeElement,
    setDisplayName: setDisplayName,
    editConnectionNotation: editConnectionNotation,
    toAddConnectionState: toAddConnectionState,
    setOwningSideProperty: setOwningSideProperty
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
          <DrawBoard onDropHandler={addDrawBoardElement}
                     drawBoardElements={erContentStore.drawBoardElements}
                     drawBoardBorderOffset={drawBoardBorderOffset}
                     diagramType={DiagramTypes.erDiagram}>

            {/* The elements inside the draw board */}
            {erContentStore.drawBoardElements.map((drawBoardElement) => (
                <DrawBoardElement  key={drawBoardElement.id}

                                   onDrawBoardElementSelected={onDrawBoardElementSelected}
                                   updateDrawBoardElementPosition={updateDrawBoardElementPosition}

                                   thisObject={drawBoardElement}
                                   updateDrawBoardElementSize = {updateDrawBoardElementSize}

                                   svgBounds={drawBoardBorderOffset}
                />
            ))}


            {/* The connections of the elements inside the draw board */}
            {erContentStore.connections.map((connection, i) => (
                <ConnectionElement
                    key={connection.id + " -- " + i}

                    connections={erContentStore.connections}
                    thisConnection={connection}
                    onConnectionSelected={onConnectionSelected}

                />
            ))}

          </DrawBoard>

          {/* The right bar, used for editing the elements in the draw board */}
          <RightBar {...rightBarProps} />
          <TransformButton transformToRel={transformToRel} invalidMessages={invalidMessages}/>
        </div>
    </div>
  );
};
export default ErManager;
