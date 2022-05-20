import React, {useState} from 'react';
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
    const offsetSamePath = 20;

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
     * The offset is applied based on the position of the element in the sorting order by id
     * of the elements with the same start and ending point (also reverse),
     * therefore every element with the same path will obtain a self-managed and different offset value
     */

    const samePath = (connection, thisConnection) => {

        if(connection.id === thisConnection.id) return true;

        // Same path as thisConnection
        if ( connection.start === thisConnection.start && connection.end === thisConnection.end ) return true;

        // Reverse path of thisConnection
        return connection.start === thisConnection.end && connection.end === thisConnection.start;

    }

    //Create offset, if there is already a line
    let offsetValue = 0;
    let connectionsSamePath = connections.filter( connection => samePath(connection, thisConnection))


    if(connectionsSamePath.length > 1){

        let sortedConnectionsSamePath = connectionsSamePath.sort((a,b) => { return a.id < b.id ? -1 : 1 } );
        let index = sortedConnectionsSamePath.indexOf(thisConnection)

        //Enable offset to the left/right and top/bottom
        let directionOffset = index % 2 ? 1 : -1;

        //Balance offset correctly, by reducing the amount of offset values by 1,
        //when a line is on the opposite site of the previously added
        let balance = directionOffset === 1 ? -1 : 0;

        offsetValue =  directionOffset * offsetSamePath * (index-balance);
    }

    const offset =
            [   {position: "left",  offset:{y: offsetValue} },
                {position: "right", offset:{y: offsetValue} },
                {position: "top",   offset:{x: offsetValue} },
                {position: "bottom",offset:{x: offsetValue} }   ]


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
        cursor: 'pointer'

    }

  return <Xarrow
                start={thisConnection.start}
                end={thisConnection.end}
                path={paths.smooth}
                labels={thisConnection.withLabel ? minMaxLabels : null}
                dashness={false}
                strokeWidth={6}
                headSize={5}
                tailSize={5}
                showHead={thisConnection.withArrow}
                showTail={false}
                showXarrow={true}
                color={color}
                gridBreak={"50%"}
                endAnchor={offset}
                startAnchor={offset}
                passProps={ConnectionPassedProps} />;
};

export default ConnectionElement;
