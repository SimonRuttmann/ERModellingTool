import React, {useState} from 'react';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';
import { resolveErComponent } from "../../ErType";

/*
    Props:
    
    Funktionen:
    HandleSelect = HandleSelect(); Diese methode wird aufgerufen, wenn eine Box selektiert wird
    SetLines = SetLines();  //Werden Lines übergeben, welche wir bereits über Lines erhalten! Hier wird dem Objekt eine Linie hinzugfügt, 
                            wenn wir im "Add Connections" bereich sind, wenn wir im "Remove connections" bereich sind entfernen wir diese
    
    Werte:
    actionState: "Normal" (nichts), "Add Connections", "Remove Connections"
    Lines -> Linien, welche bereits vorhanden sind
    Box -> id "static1", shape: "interfaceBox", type: "input" (reinziehbar) oder "normal" bzw. undefined, position: "static" oder "absolute"
            -> Im Fall von einer im Graph befindlichen box: x: "1666.2" y:"2.23423"
*/

const Box = (props) => {
  const updateXarrow = useXarrow();

  const fontFamily="arial"
  const fontSize="12"
  let background = null;

  const [isDragging, setDragging] = useState(false)


  const handleClick = (e) => {

    e.stopPropagation();
    if (isDragging===true) return;

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
          menuWindowOpened: false,
        },
      ]);
    } 
    else if (props.actionState === 'Remove Connections') {
      props.setLines((lines) =>
        lines.filter((line) => !(line.root === props.selected.id && line.end === props.box.id))
      );
    }
  };





   //On click on the box
   // -> A box is selected and the selected box is this box
  if (props.selected && props.selected.id === props.box.id) {
    background = 'rgb(200, 200, 200)';
  } 
  
  //On click on the box
  // -> Wenn im AddConnections Statfus 
  // Für jede Box gilt jetzt, wenn es eine Linie gibt, die von der Selekteirten ausgeht und hier endet -> Zeige "LemmonChiffron an"
  // Es werden alle linien durchsucht. Wenn der Linienbegin die selektierte box ist und die Linie hier endet -> LemonChiffron
  else if (
    (props.actionState === 'Add Connections'    && props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length === 0) ||
    (props.actionState === 'Remove Connections' && props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length > 0)
  ) //Fix: line.root --> line.props.start  // line.end --> line.props.end
  {
    background = 'LemonChiffon';
  }





  function onDrag() {
    setDragging(true)
    updateXarrow();
  }

  const PRESS_TIME_UNTIL_DRAG_MS = 250;
  function onStop() {
    setTimeout(() => setDragging(false) , PRESS_TIME_UNTIL_DRAG_MS)
  }

//bounds={{left: number, top: number, right: number, bottom: number}}
  //Props for svgs: id, displayText, color (highlight), fontFamily, fontSize

  const offset = 50;
  const elementWidth = 150;
  const elementHeight = 50;

  const propsForErComponent = {
    id: props.box.id,
    displayText: "abc",
    color: "#fff",
    fontSize: fontSize,
    fontFamily: fontFamily
  }

  return (
    <React.Fragment>
     
      <Draggable
         bounds={props.bounds ? {
               left: offset,
               top: props.bounds.top + offset ,
               right: props.bounds.right-props.bounds.left - elementWidth - offset ,
               bottom: props.bounds.bottom -elementHeight - offset}
               : undefined}

         onDrag={onDrag}
         onStop ={onStop}
         grid={[1, 1]} 
         scale={1} 
         defaultPosition={{x: props.box.x, y: props.box.y}}> 


        <g ref={props.box.reference} 
           id={props.box.id} 
           cursor="pointer" 
           fill="#61DAFB" 
           transform="scale(2)"

           onClick={handleClick}>  {/* style={{ transformOrigin: 'center'}} */}

          {resolveErComponent(props.box.erType, propsForErComponent)}
        </g>



      </Draggable>
      
    </React.Fragment>
  );
};


export default Box;
