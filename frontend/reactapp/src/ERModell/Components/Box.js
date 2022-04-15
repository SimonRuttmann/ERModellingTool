import React, {useState} from 'react';
import './Box.css';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';
import Entity from './Entity';
import Attribute from './Attribute';

// Auch hier lines.root -> lines.props.start
// lines.end --> lines.props.end


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


  const [isDragging, setDragging] = useState(false)

  const handleClick = (e) => {

    console.log("click and : " + isDragging)
    e.stopPropagation(); //Hier wird das Event konsumiert. Damit werden evtl. Seiteneffekte von Subelementen eleminiert.
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

  let background = null;

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

  var erObject = {};
  // eslint-disable-next-line default-case
  switch(props.box.erType){
    case "Entity":    erObject = <Entity    id={props.box.id} highlight={background} />; break;
    case "Attribute": erObject = <Attribute id={props.box.id} highlight={background} />; break;

  }
 
  //bounds="#mostouter"
  const fontFamily="arial" 
  const fontSize="12"




  function onDrag(e) {
    setDragging(true)
    updateXarrow();
  }
  const PRESS_TIME_UNTIL_DRAG_MS = 250;
  function onStop(e) {
    setTimeout(() => setDragging(false) , PRESS_TIME_UNTIL_DRAG_MS)
  }
//bounds={{left: number, top: number, right: number, bottom: number}}
  //Props for svgs: id, displayText, color (highlight), fontFamily, fontSize

  const offset = 50;
  const elementWidth = 150;
  const elementHeight = 50;
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

          <StrongEntity id={props.box.id} displayText={"Hasdfdsfsdfsdfdsffdllo"} color={"#fff"} fontSize={fontSize} fontFamily={fontFamily}/>
        </g>

      {/*
        <div
          ref={props.box.reference}
          className={`${props.position} `}
          style={{
            left: props.box.x,
            top: props.box.y
          }}
          onClick={handleClick}
          id={props.box.id}>

          {erObject}
        </div>

        */}



      </Draggable>
      
    </React.Fragment>
  );
};


function MyWrappedSvg(props){
  return (
 
    <React.Fragment>

    <path  id={props.id} d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/>
    <path  id={props.id} d="M520.5 78.1z"/>
    
    </React.Fragment>
   
  
  )
}



function MyWrappedSvg2(props){
  return (
 
    <React.Fragment>
      <ellipse strokeDasharray="5,5" ry="100" rx="200" id={props.id} cy="300" cx="300" stroke="#000" fill="#fff"/>
      <text x="400" y="260" font-mily="Verdana" fontSize="35" fill="blue">{props.displayText}</text>
    </React.Fragment>
   
  
  )
}



function StrongEntity({id, displayText, color, fontFamily, fontSize}){

  const x = 0;       const y = 0;
  var width = 137;   const height= 67;

  //If necesarry, increase width to fit text
  width = resolveRequiredWidth(width, displayText, fontSize, fontFamily)
  
  return (
    <React.Fragment>

      <rect 
        //id
        id={id} 
        
        //position
        y={y} 
        x={x} 
        
        //display style
        height={height} 
        width={width} 
        stroke="#000" 
        fill={color}/>

      <text 
        //id
        id={id} 
        
        //position
        x={x + width / 2}
        y={y + height / 2} 

        //alignment
        dominantBaseline="middle"
        textAnchor="middle" 
        
        //display text style
        fontFamily={fontFamily}
        fontSize={fontSize} 
        
        //display style
        stroke="#000" 
        strokeWidth="0" 
        fill="#000000"
        
        >{displayText}</text>

    </React.Fragment>
  )
}


function WeakEntity(props){
  return (
    <React.Fragment>
      <rect id={props.id} height="67" width="137" y="0" x="0" stroke="#000" fill="#fff"/>
      <rect id={props.id} height="57" width="127" y="5" x="5" stroke="#000" fill="#fff"/>
      <text id={props.id} textAnchor="start" fontFamily="Noto Sans JP" fontSize="24" strokeWidth="0" y="42" x="46" stroke="#000" fill="#000000">Text</text>
    </React.Fragment>
  )
}

function normalAttribute(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}

function composedAttribute(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}

function multivaluedAttribute(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}

function identifyingAttribute(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}

function weadIdentifiyingAttribute(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}

function strongRelation(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}


function weakRelation(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}



function isAStructure(props){
  return (
    <React.Fragment>
    </React.Fragment>
  )
}

function resolveRequiredWidth(width, displayText, fontSize, fontFamily){

  var textWidth = getTextWidth(displayText, `${fontSize}pt ${fontFamily}`)
  
  if(textWidth > width) return textWidth
  return width
}

function getTextWidth(text, font) {

  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));

  var context = canvas.getContext("2d");
  context.font = font;

  return context.measureText(text).width;
}

export default Box;
