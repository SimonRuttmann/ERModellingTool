import {ConnectionType} from "../DrawBoardModel/Diagram";

/**
 * Offset
 * The offset is applied based on the position of the element in the sorting order by id
 * of the elements with the same start and ending point (also reverse),
 * therefore every element with the same path will obtain a self-managed and different offset value
 */
const calculateOffsets = (connections, thisConnection, offsetFactor) => {

    if(thisConnection.horizontalAlignment === true ) return calculateForeignKeyOffset(thisConnection);

    const offset = calculateDefaultOffsets(connections, thisConnection, offsetFactor)

    const specificOffsets = calculateOffsetsIsA(offset, connections, thisConnection, offsetFactor)

    return {startOffset: specificOffsets.startOffset, endOffset: specificOffsets.endOffset}
}


const calculateDefaultOffsets = (connections, thisConnection, offsetFactor) => {

    //Create offset, if there is already a line
    let offsetValue = 0;
    let connectionsSamePath = connections.filter( connection => samePath(connection, thisConnection))

    if(connectionsSamePath.length > 1){
        let sortedConnectionsSamePath = connectionsSamePath.sort((a,b) => { return a.id < b.id ? -1 : 1 } );
        offsetValue = calculateOffsetValue(sortedConnectionsSamePath, thisConnection, offsetFactor);
    }


    return   [  {position: "left", offset: {y: offsetValue}},
                {position: "right", offset: {y: offsetValue}},
                {position: "top", offset: {x: offsetValue}},
                {position: "bottom", offset: {x: offsetValue}}  ];
}


const calculateOffsetsIsA = (defaultOffset, connections, thisConnection, offsetFactor) => {

    let startOffset = defaultOffset;
    let endOffset = defaultOffset;

    //It is ensured: (start) IsA -- Parent --> Entity (end)
    if(thisConnection.withArrow && thisConnection.connectionType === ConnectionType.parent){

        let connectionsSameDestination = connections.filter(connection => connection.start === thisConnection.start).
        sort((a,b) => { return a.id < b.id ? -1 : 1 } );

        let offsetValueStart = calculateOffsetValue(connectionsSameDestination, thisConnection, offsetFactor)
        startOffset = [{position: "top",   offset:{x: offsetValueStart} }]

    }

    //It is ensured: (start) Parent -- Inheritor --> IsA (end)
    if(thisConnection.withArrow && thisConnection.connectionType === ConnectionType.inheritor){

        let connectionsSameDestination = connections.filter(connection => connection.end === thisConnection.end).
                                                     sort((a,b) => { return a.id < b.id ? -1 : 1 } );

        let offsetValueEnd = calculateOffsetValue(connectionsSameDestination, thisConnection, offsetFactor)
        endOffset = [{position: "bottom",   offset:{x: offsetValueEnd} }]
    }

    return {endOffset: endOffset, startOffset: startOffset};
}

const calculateForeignKeyOffset  = () => {
    const offsetValue = 0;

    const newOffset =  [
        {position: "left", offset: {y: offsetValue}},
        {position: "right", offset: {y: offsetValue}} ];
    return {startOffset: newOffset, endOffset: newOffset}
}

const calculateOffsetValue = (sortedCollection, thisConnection, offsetFactor) => {

    let amountSamePaths = sortedCollection.length;
    let index = sortedCollection.indexOf(thisConnection)

    //Enable offset to the left/right and top/bottom
    let directionOffset = index % 2 ? 1 : -1;


    //Balancing of 2 will result into
    //   | ----Index 0----- |
    // A |                  | B
    //   | ----Index 1----- |
    if(amountSamePaths === 2){
        return directionOffset * offsetFactor
    }

    //Balancing of more than 2 will result into
    //   | ----Index 2----- |
    //   |                  |
    // A | ----Index 0----- | B
    //   |                  |
    //   | ----Index 1----- |

    //Balance offset correctly, by reducing the amount of offset values by 1,
    //when a line is on the opposite site of the previously added
    let balance = directionOffset === 1 ? -1 : 0;

    return ( directionOffset * offsetFactor * (index-balance) ) ;

}


const samePath = (connection, thisConnection) => {

    if(connection.id === thisConnection.id) return true;

    // Same path as thisConnection
    if ( connection.start === thisConnection.start && connection.end === thisConnection.end ) return true;

    // Reverse path of thisConnection
    return connection.start === thisConnection.end && connection.end === thisConnection.start;

}

/**
 * Contains functions to calculate the offset between connections on the same draw board element
 */
const OffsetCalculator = {
    calculateOffsets: calculateOffsets
}

export default OffsetCalculator
