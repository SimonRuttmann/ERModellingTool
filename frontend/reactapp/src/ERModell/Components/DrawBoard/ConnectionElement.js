import React, { useState } from 'react';
import Xarrow from 'react-xarrows';

/**
 * Wrapps the XArrow to add listener and additional logic
 * @param connections An array of all connections in the field (required for offset)
 * @param thisConnection The data of this connection
 * @param onConnectionSelected A function, called when the arrow is selected
 * @returns {JSX.Element}
 */
const ConnectionElement = ({connections, thisConnection, onConnectionSelected}) => {



    let arrowColor = "black"
    if(thisConnection.isSelected) arrowColor="red"

    //Color setting for on mouse enter, on mouse leave
    const [, setState] = useState({ color: 'black' });

    const setColorIfNotSelected = (color) => {
        if(!thisConnection.isSelected)
            setState({ color: color })
    }


    //Create offset, if there is already a line
    let offsetValue = 0;
    let connectionSameDestinations = connections.filter(
     connection =>
        connection.id !== thisConnection &&
        ( ( connection.start === thisConnection.start && connection.end === thisConnection.end ) ||
          ( connection.start === thisConnection.end || connection.end === thisConnection.start )
        ) )


    if(connectionSameDestinations.length > 1){
        offsetValue = -20 * connectionSameDestinations.length - 1;
    }



    const offset = {
        endAnchor:
            [{position: "left",  offset:{y: offsetValue} },
                {position: "right", offset:{y: offsetValue} },
                {position: "top",   offset:{x: offsetValue} },
                {position: "bottom",offset:{x: offsetValue} }] }


    const minMaxLabels = {
        middle: (
            <div
                contentEditable
                suppressContentEditableWarning={true}
                style={{ font: 'italic 1.5em serif', color: 'black', left: '30px' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ({thisConnection.min},{thisConnection.max})
            </div>
        )
    }


    const ConnectionProps = {
        className: "xarrow",
        onMouseEnter: () => setColorIfNotSelected("green"),
        onMouseLeave: () => setColorIfNotSelected("black"),
        onClick: (e) => {
            e.stopPropagation();
            onConnectionSelected(thisConnection.id);
        },
        cursor: 'pointer',
        start: thisConnection.start,
        end: thisConnection.end,
        showHead: thisConnection.withArrow,
        showTail: false,
        strokeWidth: 3,
        //endAnchor: offset,
        path: "straight",
        color: arrowColor,
        labels: minMaxLabels

    }


  return <Xarrow {...ConnectionProps} />;
};

export default ConnectionElement;
