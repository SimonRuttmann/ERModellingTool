import React, { useState } from 'react';
import Xarrow from 'react-xarrows';
import {OBJECTTYPE} from "../../ActionState";
import DrawBoardElement from "./DrawBoardElement";

//Wrapper für Arrows. Damit kann man diese Klicken

//{props: {line, setSelected, selected}}
/*
let newConnection =
    {
        id: `${idStart} --> ${idEnd} - ${Date.now()}`,
        start: idStart,
        end: idEnd,
        min: 1,
        max: 1,
        objectType: OBJECTTYPE.Connection,
        isSelected: false,
        withArrow: false
    }


connections={connections}
thisConnectionId={connection}
onConnectionSelected={onConnectionSelected}

*/


/**
 * Wrapps the XArrow to add listener and additional logic
 * @param connections An array of all connections in the field (required for offset)
 * @param thisConnection The data of this connection
 * @param onConnectionSelected A function, called when the arrow is selected
 * @returns {JSX.Element}
 */
const ConnectionElement = ({connections, thisConnection, onConnectionSelected}) => {

  const [state, setState] = useState({ color: 'black' });
  const defProps = {
    passProps: {
      className: 'xarrow',
      onMouseEnter: () => setState({ color: 'green' }),
      onMouseLeave: () => setState({ color: 'black' }),
      onClick: (e) => {
                          e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
                          setSelected({
                            id: { start: line.props.start, end: line.props.end },
                            type: 'arrow',
                          });
                          
                      },
      cursor: 'pointer',

    },
  };




  let color = state.color;

  //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  if (selected && selected.type === 'arrow' && selected.id.start === line.props.start && selected.id.end === line.props.end)
    color = 'green';


    //add offset if line already exists
    var offsetValue = 0;
    
    //console.log("BBBBBBBBBBBBBB")
   if(lines != undefined || lines != null){ 
    //console.log("Not undefined")
    var filterd = lines.filter( Oneline => 
       line.props.end == Oneline.props.end   && line.props.start == Oneline.props.start //|| 
    //   line.props.end == Oneline.props.start && line.props.start == Oneline.props.end
    )

   // console.log("after filter")

    if(filterd.length > 1){
     // console.log("!!!!!")
    //  console.log("filter length is: " + filterd.length)
      offsetValue = -20 * filterd.length - 1;
    }
  }


  const offset = {
    endAnchor: 
    [{position: "left",  offset:{y: offsetValue} },  
     {position: "right", offset:{y: offsetValue} },  
     {position: "top",   offset:{x: offsetValue} },
     {position: "bottom",offset:{x: offsetValue} }] }

  return <Xarrow {...{ ...defProps, ...line.props, ...state, ...offset, color, path: "straight", showHead: false, showTail: false, strokeWidth: 7}} />;
};

export default ConnectionElement;
