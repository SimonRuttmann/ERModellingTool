import React, {useEffect, useState} from 'react';
import './Playground.css';
import Box from './Components/Box';
import TopBar from './Components/TopBar';
import Xarrow from './Components/Xarrow';
import { Xwrapper } from 'react-xarrows';
import {ERTYPECATEGORY, ERTYPE, returnNamesOfCategory} from './ErTypesEnum';
import DragBarManager from "./DragBarImageManager";


function getBoundsOfSvg(){

  let svgContainer = document.getElementById("boxesContainer");
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

  const createNewElement = (e) => {
    let erType = e.dataTransfer.getData('erType');

    if (Object.keys(ERTYPE).includes(erType)){

      let newId = erType + "--" + Date.now();
      let { x, y } = e.target.getBoundingClientRect();

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



  return ( 
    <div>
   

      <Xwrapper>
        <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>



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



        {/* The draw board */}

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
        


          {/* The right bar, used for editing the elements in the draw board */}

          <TopBar {...props} />    



          {/* The connections of the elements inside the draw board */}

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
