import React, { useState } from 'react';
import Xarrow from 'react-xarrows';

//Wrapper für Arrows. Damit kann man diese Klicken

//{props: {line, setSelected, selected}}
export default ({ setSelected, selected, line, lines}) => {

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
