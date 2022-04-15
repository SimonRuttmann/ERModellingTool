import React, {useEffect, useState} from 'react';
import './Playground.css';
import Box from './Components/Box';
import TopBar from './Components/TopBar';
import Xarrow from './Components/Xarrow';
import { Xwrapper } from 'react-xarrows';
import ErTypesEnum from './ErTypesEnum';
import DragBarManager from "./DragBarImageManager";
/*
  Nächste Todo´s
  1. Die Views in TopBar einbinden.
  2. Die Relation einfügen. (evtl als svg)

*/


/*
--> 1. Finde heraus wie die position des svgs ist (Alle eckpunkte)
---> 2. Setze diese als bounds bei den svg elementen 				<Draggable bounds={{left: 100, top: 200, right: 300, bottom: 400}}>
 */


const erTypes = Object.keys(ErTypesEnum);


function getBoundsOfSvg(){


  let svgContainer = document.getElementById("boxesContainer");
  console.log(svgContainer)
  if(svgContainer === null) return;
  let bounds = svgContainer.getBoundingClientRect();

  return {
    right: bounds.right,
    left: bounds.left,
    top: bounds.top,
    bottom: bounds.bottom}


}

const PlayGround = () => {

  //Der state verwaltet die boxen und die lines
  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);
  const [counter, setCounter] = useState(0);

  // selected:{id:string,type:"arrow"|"box"}
  //hier wird die aktuelle box oder der pfeil gespeichert
  const [selected, setSelected] = useState(null);

  //hier wird verwaltet ob wir in "add connection, normal, remove connection etc sind."
  const [actionState, setActionState] = useState('Normal');

  //wenn das canvas geklickt wird ist wird die funktion mit "null" aufgerufen. -> action zu normal, clear selected
  const handleSelect = (e) => {
    if (e === null) {
      setSelected(null);
      setActionState('Normal');
    }
     else {
         setSelected({ id: e.target.id, type: 'box' });
     }
  };
/*

  const [svgBounds, setSvgBounds] = useState(undefined)
  //component did mount
  useEffect(() => {

    console.log("Did mount")
    let svgContainer = document.getElementById("boxesContainer");
    console.log(svgContainer)
    if(svgContainer === null) return;
    let bounds = svgContainer.getBoundingClientRect();

    let bounds2 = {
      right: bounds.right,
      left: bounds.left,
      top: bounds.top,
      bottom: bounds.bottom}

    console.log(bounds)

      setSvgBounds(bounds2)

  },[]);

*/
  const createNewElement = (e) => {
    let erType = e.dataTransfer.getData('erType');
  

    if (erTypes.includes(erType)){

      let newId = erType + "--" + Date.now();
      let { x, y } = e.target.getBoundingClientRect();
     /* 
      console.log("x" + e.target.getBoundingClientRect().x);
      console.log("y" + e.target.getBoundingClientRect().y)
      console.log("clientx" + e.target.getBoundingClientRect().clientX);



      console.log("left" + e.target.getBoundingClientRect().left);
      console.log("right" + e.target.getBoundingClientRect().right)
      console.log("width" + e.target.getBoundingClientRect().width);
      console.log("hight" + e.target.getBoundingClientRect().hight)


      console.log("Created a new Box with Id: " + newId + ", and Type: " + erType)
      */
      let newBox = { id: newId, name: "new "+ erType + " " + counter, x: e.clientX - x - 50, y: e.clientY - y - 50, erType: erType };
      setBoxes([...boxes, newBox]);
      setCounter(counter+1);
    }

  };

  const props = {
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setActionState,
    lines,
    setLines,
  };

  const boxProps = {
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setLines,
    lines,
  };
 // console.log("ALL INFORMATION: ")
//  console.log("ALL LINES: ")
//  console.log(lines)
 // console.log("ALL BOXES: ")
 // console.log(boxes)
  return ( 
    <div>
   

      <Xwrapper>
        <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>

                              {/* Linke Toolbar */}
          <DragBarManager erTypes={erTypes}/>

        
        {/* Zeichenbrett */}



        <div id="mostouter" className="outerDrawboardContainer scrollAble">

          <div className="drawboardBackgroundPage"/>


          <svg
            id="boxesContainer"
            className="drawboardDragArea"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => createNewElement(e)}
            style={{position: "absolute"}}>
           
           
            {boxes.map((box) => (
              <Box {...boxProps} key={box.id} box={box} bounds={getBoundsOfSvg()} position="absolute" sidePos="middle" />
            ))}
          
          </svg>

        </div>
        
        
          {/* rechte bar */}    
          <TopBar {...props} />    

          {/* xarrow connections*/}
          {lines.map((line, i) => (
            <Xarrow
              key={line.props.root + '-' + line.props.end + i}
              lines={lines}
              line={line}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
      
        </div>
      </Xwrapper>
    </div>
  );
};
export default PlayGround;
