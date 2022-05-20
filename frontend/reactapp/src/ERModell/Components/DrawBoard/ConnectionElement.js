import React, {useEffect, useState} from 'react';
import Xarrow from 'react-xarrows';

/**
 * Wrapps the XArrow to add listener and additional logic
 * @param connections An array of all connections in the field (required for offset)
 * @param thisConnection The data of this connection
 * @param onConnectionSelected A function, called when the arrow is selected
 * @returns {JSX.Element}
 */
const ConnectionElement = ({connections, thisConnection, onConnectionSelected}) => {

    const defaultColor = "black"
    const onHoverColor = "blue"
    const onSelectedColor = "red"
    const paths={smooth: "smooth", grid: "grid", straight: "straight"}

    /**
     * Color
     */

    const [color, setState] = useState('black');


    if(thisConnection.isSelected && color !== onSelectedColor) {
        setState(onSelectedColor)
    }

    if(!thisConnection.isSelected && color === onSelectedColor){
        setState(defaultColor)
    }

    const setColorIfNotSelected = (color) => {
        if(!thisConnection.isSelected)
            setState(color)
    }

    /**
     * (Min,Max) Label
     */

    const minMaxLabels = {
        middle: (
            <div
                style={{ position: 'relative', marginLeft: '30px', marginTop: "30px", font: 'italic 1.5em serif', color: 'black', left: '30px' }}>
                ({thisConnection.min},{thisConnection.max})
            </div>
        )
    }

    /**
     * Offset
     */

    //Create offset, if there is already a line
/*    let offsetValue = 0;
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
*/

    /**
     * Interaction and props passed to the underlying svg`s
     */

    const handleClick = (e) => {
        e.stopPropagation();
        onConnectionSelected(thisConnection.id);
    }

    const ConnectionPassedProps = {

        //Interaction
        onMouseEnter: () => setColorIfNotSelected(onHoverColor),
        onMouseLeave: () => setColorIfNotSelected(defaultColor),
        onClick: handleClick,

        //Styling
        className: "xarrow",
        cursor: 'pointer',
        //endAnchor: offset,

    }


  return <Xarrow
                start={thisConnection.start}
                end={thisConnection.end}
                path={paths.smooth}
                labels={minMaxLabels}
                dashness={false}
                strokeWidth={6}
                headSize={5}
                tailSize={5}
                showHead={false}
                showTail={false}
                showXarrow={true}
                color={color}
                gridBreak={"50%"}
                passProps={ConnectionPassedProps} />;
};

export default ConnectionElement;
