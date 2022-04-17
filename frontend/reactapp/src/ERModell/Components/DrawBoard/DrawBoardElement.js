import React, {useState} from 'react';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';
import { resolveErComponent } from "../../ErType";


/**
 * Creates an element which can be dragged within the given bounds inside the parent svg element <br>
 * Executes the handleSelect method when the object is selected
 *
 * <b> Parameter: </b>
 *
 * <br> onDrawBoardElementSelected:
 * <br> Function to handle the selection on this object
 *
 * <br> updateDrawBoardElementPosition:
 * <br> Function to update the position of the element
 *
 * <br> thisObject:
 * <br> The data of this object
 *
 * <br> bounds:
 * <br> The bounds, where this object should clip to
 *
 * @returns An draggable element, displayed inside the draw board
 */
const DrawBoardElement = ({ onDrawBoardElementSelected, thisObject, bounds, updateDrawBoardElementPosition}) => {

  const updateXarrow = useXarrow();
  const [isDragging, setDragging] = useState(false)

  //Define properties for er component
  const fontFamily="arial"
  const fontSize="12"

  let background = "#fff";
  if(thisObject.isSelected) background = "#e1b43c"
  else if(thisObject.isHighlighted) background = "#fffacd"

  const propsForErComponent = {
    id: thisObject.id,
    displayText: thisObject.displayName,
    color: background,
    fontSize: fontSize,
    fontFamily: fontFamily
  }

  //Offsets for bounds
  const boundsOffset = 50;
  const boundsElementWidth = 150;
  const boundsElementHeight = 50;

  //Handles the selection of this component and subcomponents
  const handleClick = (e) => {

    e.stopPropagation();

    //Prevent click event, when drag is stopped
    if (isDragging===true) return;
    onDrawBoardElementSelected(e, thisObject);
  };

  //Handle drag and drop
  function onDrag() {
    setDragging(true)
    updateXarrow();
  }

  //Question: When the on Drag stop function is executed, there is a "mouseDown" event which will trigger the onClick event.
  //The timeout here is bad practise, however solutions form stackoverflow did not work
  const PRESS_TIME_UNTIL_DRAG_MS = 250;
  function onStop(e, data) {
    updateDrawBoardElementPosition(thisObject.id, data.x, data.y)
    setTimeout(() => setDragging(false) , PRESS_TIME_UNTIL_DRAG_MS)
  }

  return (
    <React.Fragment>

      <Draggable
          onMouseDown={(e => e.stopPropagation())}

         bounds={
                  bounds ? {
                        left: boundsOffset,
                        top: bounds.top + boundsOffset ,
                        right: bounds.right-bounds.left - boundsElementWidth - boundsOffset ,
                        bottom: bounds.bottom -boundsElementHeight - boundsOffset}
                    : undefined}

         onDrag={onDrag}
         onStop ={onStop}
         grid={[1, 1]}
         scale={1}
         defaultPosition={{x: thisObject.x, y: thisObject.y}}>

        <g
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
