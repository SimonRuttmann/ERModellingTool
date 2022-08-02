import React, {useEffect, useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import ConnectionElement from './Components/DrawBoard/ConnectionElement';
import DrawBoard from "./Components/DrawBoard/DrawBoard";
import {DiagramTypes} from "./Model/Diagram";

const RelationalManager = ({syncRelContent, importedContent, triggerImportComplete}) => {

    const table = {
        id: "",
        displayName: "",
        x: "",
        y: "",
        column: []
    }

    const column = {
        id: "",
        foreignKey: false,
        foreignKeyReferencedId: "",
        primaryKey: false
    }

    /**
     * Schema for drawBoardElements
     * id: newId,
     * displayName: "new "+ erType + " " + counter,
     * isHighlighted: false,
     * isSelected: false,
     * x: e.clientX - x - 50,
     * y: e.clientY - y - 50,
     * width: 150,
     * height: 100,
     * objectType: OBJECTTYPE.DrawBoardElement,
     * erType: erType
     */
    const [drawBoardElements, setDrawBoardElements] = useState([]);

    /**
     * Schema for connections
     * id: `${idStart} --> ${idEnd} - ${Date.now()}`,
     * start: idStart,
     * end: idEnd,
     * min: 1,
     * max: 1,
     * objectType: OBJECTTYPE.Connection,
     * isSelected: false,
     * withArrow: false
     */
    const [connections, setConnections] = useState([]);


    /**
     * Synchronize data with parent for download and transformation
     */
    useEffect( () => {
        syncRelContent(drawBoardElements);
    },[drawBoardElements])


    /**
     * Import functionality
     */
    useEffect( () => {

        console.log("Importing project")
        console.log(importedContent)


        if(importedContent == null) return;

        if(importedContent.drawBoardContent != null){

            console.log(importedContent.drawBoardContent.tables)

            if(Array.isArray(importedContent.drawBoardContent.tables)) {
                setDrawBoardElements(() => [
                    ...importedContent.drawBoardContent.tables
                ])
            }

            console.log(importedContent.drawBoardContent.connections)
            if(Array.isArray(importedContent.drawBoardContent.connections)) {

                const updatedConnections = importedContent.drawBoardContent.connections.map(connection => {
                    return {...connection, withLabel: false, horizontalAlignment: true, withArrow: true, isSelected: false}
                });

                setConnections(() => [
                    ...updatedConnections
                ])
            }

            triggerImportComplete()
        }

    },[importedContent, triggerImportComplete])

    /**
     * Function given to DrawBoardElement to update the position in the state
     * @param elementId The id of the element
     * @param x The x coordinate of the element
     * @param y The y coordinate of the element
     * @see DrawBoardElement
     */
    const updateDrawBoardElementPosition = (elementId, x, y) => {

        let element = drawBoardElements.find(element => element.id === elementId)

        let otherElements = drawBoardElements.filter(element => !(element.id === elementId))

        let clone = Object.assign({}, element)
        clone.x = x;
        clone.y = y;

        setDrawBoardElements( ()=> [
            ...otherElements,
            clone
        ])


    }

    /**
     * Function given to the concrete implementations of DrawBoardElement to update the size in the state
     * @param elementId The id of the element
     * @param width The width of the element
     * @param height The height of the element
     * @see DrawBoardElement
     * @see resolveErComponent
     */
    const updateDrawBoardElementSize = (elementId, width, height) => {

        let element = drawBoardElements.find(element => element.id === elementId)

        let otherElements = drawBoardElements.filter(element => !(element.id === elementId))

        let clone = Object.assign({}, element)
        clone.width = width;
        clone.height = height;

        setDrawBoardElements( ()=> [
            ...otherElements,
            clone
        ])

    }

    const onDropOnDrawBoard = (e) => {e.stopPropagation()};
    const onConnectionSelected = (connectionId) => {};
    const onDrawBoardElementSelected = (drawBoardElementId) => {};

    /**
     * The offset between the canvas and the inner drawBoard
     * The "border" of the background page is set to 30 px offset to the mostOuter and therefore canvas
     */
    const drawBoardBorderOffset = 30;

    return (

        <div>
            <div className="canvasStyle" id="canvas" >

                {/* The draw board   */}
                <DrawBoard
                    onDropHandler={onDropOnDrawBoard}
                    drawBoardElements={drawBoardElements}
                    drawBoardBorderOffset={drawBoardBorderOffset}
                    diagramType={DiagramTypes.relationalDiagram}>

                    {/* The elements inside the draw board */}
                    {drawBoardElements.map((drawBoardElement) => (
                        <DrawBoardElement  key={drawBoardElement.id}

                                           onDrawBoardElementSelected={onDrawBoardElementSelected}
                                           updateDrawBoardElementPosition={updateDrawBoardElementPosition}

                                           thisObject={drawBoardElement}
                                           updateDrawBoardElementSize = {updateDrawBoardElementSize}

                                           svgBounds={drawBoardBorderOffset}
                        />
                    ))}


                    {/* The connections of the elements inside the draw board */}
                    {connections.map((connection, i) => (
                        <ConnectionElement
                            key={connection.id + " -- " + i}

                            connections={connections}
                            thisConnection={connection}
                            onConnectionSelected={onConnectionSelected}

                        />
                    ))}

                </DrawBoard>

            </div>
        </div>
    );
};
export default RelationalManager;
