import React, {useState} from 'react';
import Xarrow from 'react-xarrows';
import OffsetCalculator from "../../Services/Common/OffsetCalculator";

/**
 * Wraps the XArrow to add listener and additional logic
 * This element renders the arrows/connections in the Er and relational model
 * The kind of render is depends on the given connection element, who are defined in the redux slices
 * @param connections An array of all connections in the field (required for offset)
 * @param thisConnection The data of this connection
 * @param onConnectionSelected A function, called when the arrow is selected
 * @see ErContentSlice
 * @see RelationalContentSlice
 */
const ConnectionElement = ({connections, thisConnection, onConnectionSelected}) => {

    const defaultColor = "black"
    const onHoverColor = "blue"
    const onSelectedColor = "red"
    const paths={smooth: "smooth", grid: "grid", straight: "straight"}
    const offsetFactor = 20;

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
    let calculatedOffsets = OffsetCalculator.calculateOffsets(connections, thisConnection, offsetFactor)
    const startOffset = calculatedOffsets.startOffset;
    const endOffset = calculatedOffsets.endOffset;


    /**
     * Interaction and props passed to the underlying svg`s
     */

    const handleClick = (e) => {
        e.stopPropagation();
        onConnectionSelected(thisConnection.id);
    }

    // noinspection JSUnusedGlobalSymbols Justification, properties are resolved and used
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
                strokeWidth={3}
                headSize={5}
                tailSize={5}
                showHead={thisConnection.withArrow}
                showTail={false}
                showXarrow={true}
                color={color}
                curveness={0.9}
                gridBreak={"50%"}
                startAnchor={startOffset}
                endAnchor={endOffset}
                passProps={ConnectionPassedProps} />;
};

export default ConnectionElement;
