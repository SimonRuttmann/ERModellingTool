import React, {useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import ConnectionElement from './Components/DrawBoard/ConnectionElement';
import DrawBoard from "./Components/DrawBoard/DrawBoard";
import {DiagramTypes} from "./Model/Diagram";
import SqlPopUp from "./SqlPopUp";
import RelationalRightBar from "./RelationalRightBar";
import {
    ChangeDataTypeOfDrawBoardElement,
    selectRelationalContentSlice,
    UpdateDrawBoardElementPosition,
    UpdateDrawBoardElementSize
} from "../store/RelationalContentSlice";
import {useDispatch, useSelector} from "react-redux";
import {SqlDataTypes} from "./Components/ErObjectComponents/SqlDataTypes";

const RelationalManager = ({generateSql, sqlServerResult}) => {

    const relationalContentStore = useSelector(selectRelationalContentSlice);
    const relationalContentStoreAccess = useDispatch();

    const table = {
        id: "",
        displayName: "",
        x: "",
        y: "",//width, height
        column: []
    }

    const column = {
        id: "",
        foreignKey: false,
        foreignKeyReferencedId: "",
        primaryKey: false,
        dataType: SqlDataTypes.INT
    }


    //The currently selected object id, or null
    const [selectedObjectId, setSelectedObjectId] = useState(null);


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
     * @see DrawBoardElement
     */
    const updateDrawBoardElementPosition = (elementId, x, y) => {
        relationalContentStoreAccess(UpdateDrawBoardElementPosition({id: elementId, x: x, y: y}))
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
        relationalContentStoreAccess(UpdateDrawBoardElementSize({id: elementId, width: width, height: height}))
    }

    const onDropOnDrawBoard = (e) => {e.stopPropagation()};
    const onConnectionSelected = (connectionId) => {};

    const onDrawBoardElementSelected = (drawBoardElementId) => {
        setSelectedObjectId(drawBoardElementId)
    };

    const onCanvasSelected = () => {
        if(selectedObjectId == null) return;
        setSelectedObjectId(null);
    }

    /**
     * The offset between the canvas and the inner drawBoard
     * The "border" of the background page is set to 30 px offset to the mostOuter and therefore canvas
     */
    const drawBoardBorderOffset = 30;


    const changeDataType = (tableId, columnId, dataType) => {
       relationalContentStoreAccess(ChangeDataTypeOfDrawBoardElement(tableId, columnId, dataType))
    }

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
