import React, {useState} from 'react';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';
import { resolveErComponent } from "../../Services/DrawBoardModel/ErType";

/**
 * Renders an element which can be dragged within the given bounds inside the parent svg element
 * The component to render depends on the given object data
 * Use this element as s child for the DrawBoard-Component
 *
 * @param onDrawBoardElementSelected Function to handle the selection on this object
 * @param thisObject The data of this object, based on this data the render type will be selected
 * @param svgBounds The bounds, where this object should be constraint to (left and top margin to the svg)
 * @param updateDrawBoardElementPosition Function to update the position of the element
 * @param updateDrawBoardElementSize Function to update the size of the element
 * @returns {JSX.Element} An draggable element, displayed inside the draw board
 *
 * @see DrawBoard
 */
const DrawBoardElement = ({onDrawBoardElementSelected, thisObject, svgBounds, updateDrawBoardElementPosition, updateDrawBoardElementSize}) => {

  const updateConnections = useXarrow();
  const [isDragging, setDragging] = useState(false)

  //Define properties for er component
  const fontFamily="arial"
  const fontSize="12"

  let background = "#fff";
  if(thisObject.isSelected) background = "#e1b43c"
  else if(thisObject.isHighlighted) background = "#f8ec9a"

  /**
   * The properties a rendered component will receive
   * @type {{displayText, fontFamily: string, color: string, fontSize: string, id, updateDrawBoardElementSize, object}}
   */
  const propsForErComponent = {
    id: thisObject.id,
    displayText: thisObject.displayName,
    color: background,
    fontSize: fontSize,
    fontFamily: fontFamily,
    updateDrawBoardElementSize: updateDrawBoardElementSize,
    object: thisObject
  }

  /**
   * Handles the selection of this component and subcomponents
   */
  const handleClick = (e) => {

    e.stopPropagation();

    //Prevent click event, when drag is stopped
    if (isDragging===true) return;
    onDrawBoardElementSelected(thisObject.id);
  };

  /**
   * Handle drag and drop
   */
  function onDrag(dragEvent, data) {

    setDragging(true)

    updateDrawBoardElementPosition(thisObject.id, data.x, data.y)

    updateConnections();
  }

  //The timeout here is bad practise, however other solutions did not work
  const PRESS_TIME_UNTIL_DRAG_MS = 250;
  function onStop(e, data) {

    if(!isDragging) return;

    updateDrawBoardElementPosition(thisObject.id, data.x, data.y)
    setTimeout(() => setDragging(false) , PRESS_TIME_UNTIL_DRAG_MS)
  }

  /**
   * Required to use strict mode for React.Draggable
   */
  const nodeRef = React.useRef(null);

  /**
   * Wrap element into draggable
   */
  return (
    <React.Fragment>

      <Draggable nodeRef={nodeRef}
          onMouseDown={(e => e.stopPropagation())}

         bounds={
                  svgBounds ? {
                        left: svgBounds,
                        top: svgBounds}
                    : undefined}

         onDrag={onDrag}
         onStop ={onStop}
         grid={[1, 1]}
         scale={1}
          //This is necessary to allow multiple uploads of the same file
          //If a file is imported and objects are moved around and the same file is again imported, then
          //the elements' id did not change, therefore the default position will not have any effect and the elements
          //will stay on the same position as before
         position={{x: thisObject.x, y: thisObject.y}}
         defaultPosition={{x: thisObject.x, y: thisObject.y}}>

        <g ref={nodeRef}
           id={thisObject.id}
           cursor="pointer"
           fill="#61DAFB"
           transform="scale(2)"

           onClick={handleClick}>

          {resolveErComponent(thisObject.erType, propsForErComponent)}
        </g>

      </Draggable>

    </React.Fragment>
  );
};


export default DrawBoardElement;