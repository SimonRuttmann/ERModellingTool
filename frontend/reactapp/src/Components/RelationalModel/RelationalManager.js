import React, {useState} from 'react';
import '../DatabaseModellingStyle.css';
import DrawBoardElement from '../DrawingBoard/DrawBoardElement';
import ConnectionElement from '../DrawingBoard/ConnectionElement';
import DrawBoard from "../DrawingBoard/DrawBoard";
import {DiagramTypes} from "../../Services/DrawBoardModel/Diagram";
import SqlPopUp from "./SqlPopUp";
import RelationalRightBar from "./RelationalRightBar";
import {
    ChangeDataTypeOfDrawBoardElement,
    selectRelationalContentSlice,
    UpdateDrawBoardElementPosition,
    UpdateDrawBoardElementSize
} from "../../ReduxStore/RelationalContentSlice";
import {useDispatch, useSelector} from "react-redux";

/**
 * Responsible for rendering the hole relational diagram
 * Also contains the interaction logic and provides it to child components
 *
 * The state of all connections and elements in the diagrams are kept in the redux store
 *
 * @param generateSql A function executed, when the user wants to generate sql based on this diagram
 * @param sqlServerResult The sql code provided by the server for this diagram
 * @see RelationalContentSlice
 */
const RelationalManager = ({generateSql, sqlServerResult}) => {

    const relationalContentStore = useSelector(selectRelationalContentSlice);
    const relationalContentStoreAccess = useDispatch();

    //The currently selected object id, or null
    const [selectedObjectId, setSelectedObjectId] = useState(null);


    /**
     * Creates an object from the current state and
     * executes generateSql to receive sql from the server
     * @see generateSql
     */
    const prepareSqlRequest = () => {
        let dto = { projectVersion: 1, projectName: "", projectType: "",
                    drawBoardContent: {
                        tables: relationalContentStore.drawBoardElements,
                        connections: relationalContentStore.connections
                    }};

        generateSql(dto)
    }

    /**
     * Function given to DrawBoardElement to update the position in the state
     * @param elementId The id of the element
     * @param x The x coordinate of the element
     * @param y The y coordinate of the element
     */
    const updateDrawBoardElementPosition = (elementId, x, y) => {
        relationalContentStoreAccess(UpdateDrawBoardElementPosition({id: elementId, x: x, y: y}))
    }

    /**
     * Function given to the concrete implementations of DrawBoardElement to update the size in the state
     * @param elementId The id of the element
     * @param width The width of the element
     * @param height The height of the element
     */
    const updateDrawBoardElementSize = (elementId, width, height) => {
        relationalContentStoreAccess(UpdateDrawBoardElementSize({id: elementId, width: width, height: height}))
    }

    /**
     * When clicked on an element, this function is invoked and selects the element
     * @param drawBoardElementId The id of the element to select
     */
    const onDrawBoardElementSelected = (drawBoardElementId) => {
        setSelectedObjectId(drawBoardElementId)
    };

    /**
     * Clears selection, when the canvas (not an element inside the canvas) is clicked
     */
    const onCanvasSelected = () => {
        if(selectedObjectId == null) return;
        setSelectedObjectId(null);
    }

    /**
     * The offset between the canvas and the inner drawBoard
     * The "border" of the background page is set to 30 px offset to the mostOuter and therefore canvas
     */
    const drawBoardBorderOffset = 30;


    /**
     * Invoked by the right sidebar to change the data type
     * @see ChangeDataTypeOfDrawBoardElement
     */
    const changeDataType = (tableId, columnId, dataType) => {
       relationalContentStoreAccess(ChangeDataTypeOfDrawBoardElement({tableId: tableId, columnId: columnId, dataType: dataType}))
    }

    //Empty handlers connected to the drawBoardElements and connections
    const onDropOnDrawBoard = (e) => {e.stopPropagation()};
    //noinspection JSUnusedLocalSymbols Justification, not used handler
    const onConnectionSelected = (connectionId) => {};

    return (

        <div>
            <div className="canvasStyle" id="canvas" onClick={() => onCanvasSelected(null)}>

                {/* The draw board   */}
                <DrawBoard
                    onDropHandler={onDropOnDrawBoard}
                    drawBoardElements={relationalContentStore.drawBoardElements}
                    drawBoardBorderOffset={drawBoardBorderOffset}
                    diagramType={DiagramTypes.relationalDiagram}>

                    {/* The elements inside the draw board */}
                    {relationalContentStore.drawBoardElements.map((drawBoardElement) => (
                        <DrawBoardElement  key={drawBoardElement.id}

                                           onDrawBoardElementSelected={onDrawBoardElementSelected}
                                           updateDrawBoardElementPosition={updateDrawBoardElementPosition}

                                           thisObject={drawBoardElement}
                                           updateDrawBoardElementSize = {updateDrawBoardElementSize}

                                           svgBounds={drawBoardBorderOffset}
                        />
                    ))}


                    {/* The connections of the elements inside the draw board */}
                    {relationalContentStore.connections.map((connection, i) => (
                        <ConnectionElement
                            key={connection.id + " -- " + i}

                            connections={relationalContentStore.connections}
                            thisConnection={connection}
                            onConnectionSelected={onConnectionSelected}

                        />
                    ))}
                </DrawBoard>

                <RelationalRightBar drawBoardElements={relationalContentStore.drawBoardElements} selectedObjectId={selectedObjectId} changeDataType={changeDataType}/>
                <SqlPopUp sqlCode={sqlServerResult} prepareSqlRequest={prepareSqlRequest}/>
            </div>
        </div>
    );
};
export default RelationalManager;
