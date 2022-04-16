import React, {useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import TopBar from './Components/RightSideBar/TopBar';
import Xarrow from './Components/DrawBoard/Xarrow';
import { Xwrapper } from 'react-xarrows';
import {ERTYPECATEGORY, ERTYPE, returnNamesOfCategory} from './ErType';
import DragBarManager from "./Components/LeftSideBar/DragBarImageManager";
import {getBoundsOfSvg} from "./Components/SvgUtil/SvgUtils";


const PlayGround = () => {

  //Der state verwaltet die boxen und die lines
  const [drawBoardElements, setDrawBoardElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [counter, setCounter] = useState(0);

  // selected:{id:string,type:"arrow"|"box"}
  //hier wird die aktuelle box oder der pfeil gespeichert
  const [selectedObject, setSelectedObject] = useState(null);

  //hier wird verwaltet ob wir in "add connection, normal, remove connection etc sind."
  const [actionState, setActionState] = useState('Normal');

  //wenn das canvas geklickt wird ist wird die funktion mit "null" aufgerufen. -> action zu normal, clear selected


  const onDrawBoardElementSelected = (e, selectedElement) => {
    if (e === null) {
      setSelectedObject(null);
      setActionState('Normal');
    }
    else {
      setSelectedObject({ id: e.target.id, type: 'box' });
    }
  };


  const handleSelect = (e) => {
    if (e === null) {
      setSelectedObject(null);
      setActionState('Normal');
    }
     else {
         setSelectedObject({ id: e.target.id, type: 'box' });
     }
  };


  const addDrawBoardElement = (e) => {
    console.log("Add a new draw board element")

    let erType = e.dataTransfer.getData('erType');

    if (Object.keys(ERTYPE).includes(erType)){

      let newId = erType + "--" + Date.now();
      let { x, y } = e.target.getBoundingClientRect();

      let newBox = {
        id: newId,
        name: "new "+ erType + " " + counter,
        x: e.clientX - x - 50,
        y: e.clientY - y - 50,
        erType: erType
      };

      setDrawBoardElements([...drawBoardElements, newBox]);
      setCounter(counter+1);
    }

  };

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
    id:
    start: id zu box
    end:  id zu box


   */




  const props = {
    boxes: drawBoardElements,  //State Boxes
    setBoxes: setDrawBoardElements, //Set Methode
    selected: selectedObject,
    handleSelect,
    actionState,
    setActionState,
    lines: connections,
    setLines: setConnections,
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
            onDrop={(e) => addDrawBoardElement(e)}
            style={{position: "absolute"}}>

            {drawBoardElements.map((drawBoardElement) => (
              <DrawBoardElement  key={drawBoardElement.id}

                                 handleSelect={handleSelect}
                                 addConnection={addConnection}
                                 removeConnection={removeConnection}

                                 actionState={actionState}
                                 selectedObject={selectedObject}

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
