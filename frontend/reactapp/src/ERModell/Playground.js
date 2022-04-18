import React, {useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import TopBar from './Components/RightSideBar/TopBar';
import Xarrow from './Components/DrawBoard/Xarrow';
import { Xwrapper } from 'react-xarrows';
import {ERTYPECATEGORY, ERTYPE, returnNamesOfCategory} from './ErType';
import DragBarManager from "./Components/LeftSideBar/DragBarImageManager";
import {getBoundsOfSvg} from "./Components/SvgUtil/SvgUtils";
import {ACTIONSTATE, ACTIONTYPE} from "./ActionState";


const PlayGround = () => {

  //Der state verwaltet die boxen und die lines
  const [drawBoardElements, setDrawBoardElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [counter, setCounter] = useState(0);

  // selected:{id:string,type:"arrow"|"box"}
  //hier wird die aktuelle box oder der pfeil gespeichert
  const [selectedObject, setSelectedObject] = useState(null);

  //hier wird verwaltet ob wir in "add connection, normal, remove connection etc sind."
  const [actionState, setActionState] = useState(ACTIONSTATE.Default);

  //wenn das canvas geklickt wird ist wird die funktion mit "null" aufgerufen. -> action zu normal, clear selected


  const onCanvasSelected = (e) => {

    unselectPreviousDrawBoardElement();
    setSelectedObject(null);

    setActionState(ACTIONSTATE.Default);
  }

  const onDrawBoardElementSelected = (e, selectedElement) => {

    //click on draw board element

    if( actionState === ACTIONSTATE.Default) {

      unselectPreviousDrawBoardElement();
      setSelectedObject({id: e.target.id, type: ACTIONTYPE.DrawElement});
      setDrawBoardElementSelected(e.target.id, true)

    }


    if( actionState === ACTIONSTATE.AddConnection) {

      unselectPreviousDrawBoardElement();
      addConnection(selectedObject.id,e.target.id) //TODO von wo nach wo? vom bisher selectierten zum neu selektierten
      setSelectedObject({id: e.target.id, type: ACTIONTYPE.DrawElement});
      setDrawBoardElementSelected(e.target.id, true)

    }

    /* Gibts nicht!
    if(actionState === ACTIONSTATE.RemoveDrawBoardElement) {

      unselectPreviousDrawBoardElement();
      setSelectedObject(null);
      removeDrawBoardElement(e.target.id)

    }
    */


  };


  const onConnectionSelected = (e, selectedElement) => {

    //click on draw board element

    if( actionState === ACTIONSTATE.Default ||
        actionState === ACTIONSTATE.AddConnection) {

      //TODO 1. Unselected prev. Arrow object 2. set state object selected 3. Select this object e.target.id,
      unselectPreviousDrawBoardElement();
      setSelectedObject({id: e.target.id, type: ACTIONTYPE.Connection});
      setDrawBoardElementSelected(e.target.id, true)
    }


    //Er drückt auf eine assoziation --> assoziation löschen --> im component menu rechts --> removeConnection() --> KEIN actionstate!
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
        erType: erType
      };

      setDrawBoardElements([
          ...drawBoardElements,
        newDrawBoardElement]);
      setCounter(counter+1);
    }

  };

  // Question: https://stackoverflow.com/questions/36985738/how-to-unmount-unrender-or-remove-a-component-from-itself-in-a-react-redux-typ
  // We use mutable state manipulation, but is should be immutable, by doing so i receive an error
  const updateDrawBoardElementPosition = (elementId, x, y) => {

    let element = drawBoardElements.find(element => element.id === elementId)

    //This is mutable state manipulation
    element.x = x;
    element.y = y;

  }


  const removeDrawBoardElement = (elementId) => {
    console.log("Removing draw board element with id: " + elementId)

    setDrawBoardElements((prevState => [
      prevState.filter((element) => !(element.id === elementId))
    ]))
  }

  const addConnection = (idStart, idEnd) => {
    console.log("Creating a new connection from: " + idStart + " to " + idEnd)

    let newConnection = {start: idStart, end: idEnd}

    setConnections((prevState) => [
      ...prevState,
      newConnection
    ])
  }

  const removeConnection = (idStart, idEnd) => {
    console.log("Removing a connection from: " + idStart + " to " + idEnd)

    setConnections((prevState) => [
      prevState.filter((connection)=>!(connection.start === idStart && connection.end === idEnd))
    ])
  }


  const highlightDrawBoardElements = () => {

  }

  const setDrawBoardElementSelected = (id, isSelected) => {

    let selectedElement = drawBoardElements.find(element => element.id === id)
    selectedElement.isSelected = isSelected;

    let copy = Object.assign({},selectedElement)
    console.log(copy)
    let notSelectedElements = drawBoardElements.filter(element => !(element.id === id))

    setDrawBoardElements([
        copy,
        ...notSelectedElements
    ])
  }

  const unselectPreviousDrawBoardElement = () => {

    if(selectedObject === null) return;

    setDrawBoardElementSelected(selectedObject.id, false);
  }




  //eine box:
  /*
    id:   unique id mit Date.now()
    name: "string" --> displayName
    x: Position am anfang
    y: Position am anfang
    erType: Type des Elements

   */


  // eine connection:
  /*
    id: start-ende-date-now
    start: id zu box
    end:  id zu box


   */




  const props = {
    boxes: drawBoardElements,  //State Boxes
    setBoxes: setDrawBoardElements, //Set Methode
    selected: selectedObject,
    actionState,
    setActionState,
    lines: connections,
    setLines: setConnections,
  };

/*
  //Diese Idee funktioniert (es muss allerdings der transform zu den subelementen gesetzt werden, eine andere idee ist es, durch das verschieben eines objektes die background page zu
  // vergrößern, dadurch entsteht eine scrollbar wenn overflow = scroll ist!

  //Canvas moving by transforming the svg !
  const [canvasPosition, setCanvasPosition] = useState( {
    startPosition: {x: 0, y: 0},
    relativePosition: {x: 0, y: 0}
  })

  const [rotateCanvas, setRotateCanvas] = useState(false)

  function OnMouseDown(mouseEvent){

    console.log("ON MOUSE DOWN")

    console.log(mouseEvent.clientX)
    console.log(mouseEvent.clientY)

    setRotateCanvas(true)

    setCanvasPosition({
      startPosition: {x: mouseEvent.clientX, y: mouseEvent.clientY},
      relativePosition: {...canvasPosition.relativePosition}
    })
  }

  function OnMouseMove(mouseEvent){

    if(!rotateCanvas) return false;

    console.log("ON MOUSE MOVE")


    let startX = canvasPosition.startPosition.x;
    let startY = canvasPosition.startPosition.y;

    let relativePositionX = canvasPosition.relativePosition.x + mouseEvent.clientX - startX;
    let relativePositionY = canvasPosition.relativePosition.y + mouseEvent.clientY - startY;

    console.log(relativePositionX)
    console.log(relativePositionY)
    setCanvasPosition((prevState) => ({
      startPosition:  {x: mouseEvent.clientX, y: mouseEvent.clientY},
      relativePosition: {x: relativePositionX, y: relativePositionY}
    }))

    mouseEvent.stopPropagation();

  }


  function OnMouseUp(mouseEvent){

    if(!rotateCanvas) return false;

    setRotateCanvas(false)

    mouseEvent.stopPropagation();

    // We do net set the canvas position, as the relative position is correct and
    // the start position will be overwritten by the next on mouse down event
  }

  let relativePositionX = canvasPosition.relativePosition.x
  let relativePositionY = canvasPosition.relativePosition.y
  on most outer: onMouseDown={OnMouseDown} onMouseMove={OnMouseMove} onMouseUp={OnMouseUp}
 in svg:  style={{position: "absolute", transform: `translate(${relativePositionX}px, ${relativePositionY}px)`}}>
*/
  return (
    <div>


      <Xwrapper>
        <div className="canvasStyle" id="canvas" onClick={() => onCanvasSelected(null)}>



          {/* The left toolbar, containing the elements to drag into the draw board  */}

          <div className="leftSidebarContainer">
              <div className="leftSidebarSelectionContainer">

                <div className="leftSidebarMainTitle">Er Objects</div>
                <hr className="leftSidebarDivider"/>

                <div className="leftSidebarTitle">Attributes</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.Attribute)}/>
                <hr className="leftSidebarDivider"/>

                <div className="leftSidebarTitle">Entities</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.Entity)}/>
                <hr className="leftSidebarDivider"/>

                <div className="leftSidebarTitle">Relations</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.Relation)}/>
                <hr className="leftSidebarDivider"/>

                <div className="leftSidebarTitle">IsA Structure</div>
                <DragBarManager erTypes={returnNamesOfCategory(ERTYPECATEGORY.IsAStructure)}/>
                <hr className="leftSidebarDivider"/>
            </div>
        </div>



        {/* The draw board   style={{height: "4000px", width: "4000px"}}*/}

        <div id="mostouter" className="outerDrawboardContainer scrollAble">

          <div className="drawboardBackgroundPage"/>

          <svg
            id="boxesContainer"
            className="drawboardDragArea"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => addDrawBoardElement(e)}
            style={{position: "absolute"}}>

            {drawBoardElements.map((drawBoardElement) => (
              <DrawBoardElement  key={drawBoardElement.id}

                                 onDrawBoardElementSelected={onDrawBoardElementSelected}
                                 updateDrawBoardElementPosition={updateDrawBoardElementPosition}

                                 thisObject={drawBoardElement}
                                 bounds={getBoundsOfSvg()}
                                 />
            ))}

          </svg>

        </div>



          {/* The right bar, used for editing the elements in the draw board */}

          <TopBar {...props} />



          {/* The connections of the elements inside the draw board */}

          {connections.map((line, i) => (
            <Xarrow
              key={line.props.root + '-' + line.props.end + i}
              lines={connections}
              line={line}
              selected={selectedObject}
              setSelected={setSelectedObject}
            />
          ))}

        </div>
      </Xwrapper>
    </div>
  );
};
export default PlayGround;
/**
 * @summary Creates an element which can be dragged within the given bounds inside the parent svg element <br>
 * - Executes the handleSelect method when the object is clicked
 *
 * @param handleSelect  Function to handle the selection on this object
 * @param addConnection Function to add a new connection
 * @param removeConnection Function to remove a connection
 * @param actionState The current actionState
 * @param selectedObject The selectedObject, if a object is selected
 * @param thisObject The data of this object
 * @param bounds The bounds, where this object should clip to
 * @returns An draggable element
 */

/*
console.log("Click on " + props.box.id )
    if (props.actionState === 'Normal') {
      props.handleSelect(e);
    }

    else if (props.actionState === 'Add Connections' && props.selected.id !== props.box.id) {
      console.log("Creating a new line: From: " + props.selected.id + " to: "  + props.box.id)
      props.setLines((lines) => [
        ...lines,
        {
          props: { start: props.selected.id, end: props.box.id },
        },
      ]);
    }
    else if (props.actionState === 'Remove Connections') {
      props.setLines((lines) =>
        lines.filter((line) => !(line.root === props.selected.id && line.end === props.box.id))
      );
    }
 */


/*


   //On click on the box
   // -> A box is selected and the selected box is this box
  if (props.selected && props.selected.id === props.box.id) {
    background = 'rgb(200, 200, 200)';
  }

  //On click on the box
  // -> Wenn im AddConnections Statfus
  // Für jede DrawBoardElement gilt jetzt, wenn es eine Linie gibt, die von der Selekteirten ausgeht und hier endet -> Zeige "LemmonChiffron an"
  // Es werden alle linien durchsucht. Wenn der Linienbegin die selektierte box ist und die Linie hier endet -> LemonChiffron
  else if (
    (props.actionState === 'Add Connections'    && props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length === 0) ||
    (props.actionState === 'Remove Connections' && props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length > 0)
  ) //Fix: line.root --> line.props.start  // line.end --> line.props.end
  {
    background = 'LemonChiffon';
  }

 */