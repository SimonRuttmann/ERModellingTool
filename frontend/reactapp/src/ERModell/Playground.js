import React, {useLayoutEffect, useRef, useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import RightBar from './Components/RightSideBar/RightBar';
import Xarrow from './Components/DrawBoard/Xarrow';
import { Xwrapper } from 'react-xarrows';
import {ERTYPECATEGORY, ERTYPE, returnNamesOfCategory} from './ErType';
import DragBarManager from "./Components/LeftSideBar/DragBarImageManager";
import {ACTIONSTATE, ACTIONTYPE, ConnectionCardinality, OBJECTTYPE} from "./ActionState";

const PlayGround = () => {

  //Elements on the field
  const [drawBoardElements, setDrawBoardElements] = useState([]);
  const [connections, setConnections] = useState([]);

  //Adding the default display name based on this counter
  const [counter, setCounter] = useState(0);

  //The currently selected object, or null
  const [selectedObject, setSelectedObject] = useState(null);

  //The current ActionState, representing the current user action
  const [actionState, setActionState] = useState(ACTIONSTATE.Default);




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

      increaseBounds(newDrawBoardElement.x, newDrawBoardElement.y)
    }


  };

  // Question: https://stackoverflow.com/questions/36985738/how-to-unmount-unrender-or-remove-a-component-from-itself-in-a-react-redux-typ
  // We use mutable state manipulation, but is should be immutable, by doing so i receive an error
  /**
   * Function given to DrawBoardElement to update the position in the state
   * @param elementId The id of the element
   * @param x The x coordinate of the element
   * @param y The y coordinate of the element
   * @see DrawBoardElement
   */
  const updateDrawBoardElementPosition = (elementId, x, y) => {

    let element = drawBoardElements.find(element => element.id === elementId)

    //This is mutable state manipulation
    element.x = x;
    element.y = y;

  }

  // Question: https://stackoverflow.com/questions/36985738/how-to-unmount-unrender-or-remove-a-component-from-itself-in-a-react-redux-typ
  // We use mutable state manipulation, but is should be immutable, by doing so i receive an error

  //here:
  // Warning: Each child in a list should have a unique "key" prop.
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

    //This is mutable state manipulation
    element.width = width;
    element.height = height;

    //let otherElement = drawBoardElements.filter(element => !(element.id === elementId))

    //let clone = Object.assign({}, element)
    //clone.width = width;
    //clone.height = height;

    //setDrawBoardElements( ()=> [
    //  {...otherElement},
    //  clone
    //])
  }


  const removeDrawBoardElement = (elementId) => {
    console.log("Removing draw board element with id: " + elementId)

    setConnections((prevState => [
      prevState.filter(connection => connection.start === elementId || connection.end === elementId)
    ]))

    setDrawBoardElements((prevState => [
      prevState.filter((element) => !(element.id === elementId))
    ]))

    setSelectedObject(null)

    decreaseBounds()
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
          objectType: OBJECTTYPE.Connection
        }

    setConnections((prevState) => [
      ...prevState,
      newConnection
    ])
  }

  const removeConnectionByObjectIds = (idStart, idEnd) => {
    console.log("Removing a connection from: " + idStart + " to " + idEnd)

    setConnections((prevState) => [
      prevState.filter((connection)=>!(connection.start === idStart && connection.end === idEnd))
    ])
  }

  const removeConnectionDirect = (connectionId) => {
    setConnections( (prevState => [
      prevState.filter((connection)=>!(connectionId === connection.id))
    ]))
  }


  const highlightDrawBoardElements = () => {

  }

  const setDrawBoardElementSelected = (id, isSelected) => {

    let selectedElement = drawBoardElements.find(element => element.id === id)
    selectedElement.isSelected = isSelected;

    let copy = Object.assign({},selectedElement)

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

  const setDisplayName = (elementId, value) => {

    let changedElement = drawBoardElements.find(element => element.id === elementId)

    changedElement.display = value;

    let clone = Object.assign({}, changedElement)
    setConnections((prevState => [
      drawBoardElements.filter(element => !(element.id === elementId)),
      clone
    ]))

  }

  const editConnectionNotation = (connectionId, minMax, notation) => {

    let changedConnection = connections.find(connection => connection.id === connectionId)

    if(minMax === ConnectionCardinality.Min) changedConnection.min = notation;
    if(minMax === ConnectionCardinality.Max) changedConnection.max = notation;

    let clone = Object.assign({}, changedConnection)
    setConnections((prevState => [
        connections.filter(connection => !(connection.id === connectionId)),
        clone
    ]))

  }

  //eine box:
  /*
    id:   unique id mit Date.now()
    name: "string" --> displayName
    x: Position am anfang
    y: Position am anfang
    width: Die breite des elements
    height: Die höhe des elements
    objectType: OBJECTTYPE.DrawBoardElement
    erType: Type des Elements

   */


  // eine connection:
  /*
    id: start-ende-date-now
    start: id zu box
    end:  id zu box
    min:
    max:
    objectType: OBJECTTYPE.Connection,

   */



  const rightBarProps = {
    selectedObject: selectedObject,
    connections: connections,
    drawBoardElements: drawBoardElements,
    removeDrawBoardElement: removeDrawBoardElement,
    removeConnection: removeConnectionDirect,
    setDisplayName: setDisplayName,
    editConnectionNotation: editConnectionNotation,
    setActionState: setActionState,
    actionState: actionState
  }


  // *****************************  Handle page increment/decrement  *****************************

  //TODO replace with correct values of er elements
  //Work:
  // 1. Add with and height properties to "drawBoardElement" (depending on text, width is dynamic),
  // 2. resolve elements instead of positions,
  // 3. apply offsets
  const elementWidthOffset = 150;
  const elementHeightOffset = 75;


  const drawBoardBorderOffset = 30; //the "border" of the background page, 30 px offset to the svg in height and width
  const oneBackgroundPageVertical = 900;
  const oneBackgroundPageHorizontal = 640;

  const [amountBackgroundPages,setAmountBackgroundPages] = useState({horizontal: 1, vertical: 1})

  function getBackgroundPageBounds(pagesHorizontal, pagesVertical) {
    return {
      x: drawBoardBorderOffset + pagesHorizontal * oneBackgroundPageHorizontal,
      y: drawBoardBorderOffset + pagesVertical * oneBackgroundPageVertical
    }
  }

  /**
   * Standalone function to decrease the bounds,
   * e.g. minimize the amount of pages displayed, if possible
   * @required drawBoardElements elements inside the draw board need to be added to the state
   * @see drawBoardElements
   * @see setDrawBoardElements
   */
  function decreaseBounds(){

    let updatedPages = decreasePageIfNecessary(amountBackgroundPages.horizontal, amountBackgroundPages.vertical)

    setAmountBackgroundPages(() => ({
      horizontal: updatedPages.horizontal,
      vertical: updatedPages.vertical
    }))
  }


  /**
   * Standalone function to increase the bounds,
   * e.g. increase the amount of pages displayed,
   * when the given coordinates are outside of displayed pages
   * The element does not need to be added to the state already
   * @param elementX The x-Coordinate of the element
   * @param elementY The y-Coordinate of the element
   */
  function increaseBounds(elementX, elementY){
    let updatedPages = increasePageIfNecessary(elementX, elementY, amountBackgroundPages.horizontal, amountBackgroundPages.vertical)

    setAmountBackgroundPages(() => ({
      horizontal: updatedPages.horizontal,
      vertical: updatedPages.vertical
    }))

  }

  /**
   * Function to increase or decrease the amount of pages
   * displayed depending on the elements within the draw board
   * @param elementX The x-Coordinate of the element
   * @param elementY The y-Coordinate of the element
   * @required drawBoardElements elements inside the draw board need to be added to the state
   * @see drawBoardElements
   * @see setDrawBoardElements
   */
  function adjustBounds(elementX, elementY){

    let currentPagesHorizontal = amountBackgroundPages.horizontal;
    let currentPagesVertical = amountBackgroundPages.vertical;

    let updatedIncreasedPages = increasePageIfNecessary(elementX, elementY, currentPagesHorizontal, currentPagesVertical)

    let updatedPages = decreasePageIfNecessary(updatedIncreasedPages.horizontal, updatedIncreasedPages.vertical)

    setAmountBackgroundPages(() => ({
      horizontal: updatedPages.horizontal,
      vertical: updatedPages.vertical
    }))

  }


  function increasePageIfNecessary(x, y, pagesHorizontal, pagesVertical){
    let page = getBackgroundPageBounds(pagesHorizontal, pagesVertical);


    x = x + elementWidthOffset;
    y = y + elementHeightOffset;


    if(x > page.x && y > page.y) return {
        horizontal: pagesHorizontal + 1,
        vertical: pagesVertical + 1
      }

    else if(x > page.x) return {
      horizontal: pagesHorizontal + 1,
      vertical: pagesVertical
    }

    else if(y > page.y) return {
      horizontal: pagesHorizontal,
      vertical: pagesVertical + 1
    }

    return {
      horizontal: pagesHorizontal,
      vertical: pagesVertical
    }

  }

  function decreasePageIfNecessary(pagesHorizontal, pagesVertical){

    //Get highest x and highest y, which are required to fit within the pages

    let maxX = 0;
    let maxY = 0;

    drawBoardElements.forEach( element => {
      if(element.x>maxX) maxX = element.x
      if(element.y>maxY) maxY = element.y
    })


    maxX = maxX + elementWidthOffset;
    maxY = maxY + elementHeightOffset;

    return getPageReductionForPosition(maxX, maxY, pagesHorizontal, pagesVertical)
  }


  function getPageReductionForPosition(x, y, pagesHorizontal, pagesVertical){

    let bounds = getBackgroundPageBounds(pagesHorizontal, pagesVertical);

    let newHorizontalPages = getPageReductionForAxis(x, bounds.x, pagesHorizontal, oneBackgroundPageHorizontal)
    let newVerticalPages = getPageReductionForAxis(y, bounds.y, pagesVertical, oneBackgroundPageVertical)

    return {
      horizontal: newHorizontalPages,
      vertical: newVerticalPages
    }
  }

  function getPageReductionForAxis(elementPos, pagePos, amountPages, pageSize){

    let amountDecreaseOfPages = 0;
    let reducedSize = pagePos;

    //Condition: At least 1 pages needs to be remaining
    while(amountPages > amountDecreaseOfPages){

      reducedSize = reducedSize - pageSize;

      //Reduce page by 1
      if(reducedSize > elementPos) amountDecreaseOfPages++;

      //No further reduction possible, due to element
      else break;
    }

    return amountPages - amountDecreaseOfPages
  }



  // *****************************  Handle svg size  *****************************

  /**
   * The svg size must be adjusted depending on the size of the area covered by the background pages
   * The size itself is stored within this state
   */
  const [svgSize, setSvgSize] = useState({
    width: `calc(100% - ${drawBoardBorderOffset}px)`,
    height: `calc(100% - ${drawBoardBorderOffset}px)`
  })

  /**
   * reference to the background pages
   * @type {React.MutableRefObject<null>}
   */
  const backgroundPageRef = useRef(null)

  /**
   * reference to the most outer div of the draw board element
   * @type {React.MutableRefObject<null>}
   */
  const mostOuterDiagramDivRef = useRef(null)

  /**
   * If the background pages are not greater than the viewport, the svg area is set
   * to a 100% - the offset of the svg on the top and left
   *
   * If the background pages increase and create an overflow in the parent element
   * the svg is increased to the size of the area, provided by the
   * background pages (with the border of the page area)
   */
  useLayoutEffect( () => {
    //BackgroundPage

    //noinspection JSUnresolvedVariable Justification, variable is resolved
    let withPage = backgroundPageRef.current.offsetWidth;
    //noinspection JSUnresolvedVariable
    let heightPage = backgroundPageRef.current.offsetHeight;

    //The most outer div

    //noinspection JSUnresolvedVariable Justification, variable is resolved
    let mostOuterWidth = mostOuterDiagramDivRef.current.offsetWidth;
    //noinspection JSUnresolvedVariable Justification, variable is resolved
    let mostOuterHeight = mostOuterDiagramDivRef.current.offsetHeight;

    //Set the size to 100% - the offset of the svg to the left and top
    let svgWidth = `calc(100% - ${drawBoardBorderOffset}px)`;
    let svgHeight = `calc(100% - ${drawBoardBorderOffset}px)`;

    //Override the size, if the background page is greater than the 100% - offset (== pages overflow)
    if(withPage + oneBackgroundPageHorizontal > mostOuterWidth){
      svgWidth = `${oneBackgroundPageHorizontal * amountBackgroundPages.horizontal + + oneBackgroundPageHorizontal}px`
    }
    
    if(heightPage + oneBackgroundPageVertical > mostOuterHeight){
      svgHeight = `${oneBackgroundPageVertical * amountBackgroundPages.vertical + oneBackgroundPageVertical}px`
    }

    setSvgSize(()=> ({
        height: svgHeight, 
        width: svgWidth
      }))
    
    }, [amountBackgroundPages.horizontal, amountBackgroundPages.vertical])
  

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



        {/* The draw board   */}

        <div id="mostouter" className="outerDrawboardContainer scrollAble" ref={mostOuterDiagramDivRef}>

          <div className="drawboardBackgroundPage"
               ref={backgroundPageRef}
               style={{
                    height: `${oneBackgroundPageVertical * amountBackgroundPages.vertical}px`,
                    width:  `${oneBackgroundPageHorizontal *  amountBackgroundPages.horizontal}px`
                }}/>

          <svg
            id="boxesContainer"
            className="drawboardDragArea"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => addDrawBoardElement(e)}
            style={{
              position: "absolute",
              left: `${drawBoardBorderOffset}px`,
              top: `${drawBoardBorderOffset}px`,
              height: svgSize.height,
              width:  svgSize.width
            }}

          >

            {drawBoardElements.map((drawBoardElement) => (
              <DrawBoardElement  key={drawBoardElement.id}

                                 onDrawBoardElementSelected={onDrawBoardElementSelected}
                                 updateDrawBoardElementPosition={updateDrawBoardElementPosition}

                                 thisObject={drawBoardElement}
                                 updateDrawBoardElementSize = {updateDrawBoardElementSize}

                                 adjustBounds={adjustBounds}

                                 svgBounds={drawBoardBorderOffset}
                                 />
            ))}

          </svg>

        </div>



          {/* The right bar, used for editing the elements in the draw board */}

          <RightBar {...rightBarProps} />



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
