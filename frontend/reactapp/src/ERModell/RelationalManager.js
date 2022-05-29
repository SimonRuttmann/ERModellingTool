import React, {useEffect, useState} from 'react';
import './Playground.css';
import DrawBoardElement from './Components/DrawBoard/DrawBoardElement';
import RightBar from './Components/RightSideBar/RightBar';
import ConnectionElement from './Components/DrawBoard/ConnectionElement';
import {ERTYPE} from './Model/ErType';
import {ACTIONSTATE, ConnectionCardinality, OBJECTTYPE} from "./Model/ActionState";
import {resolveObjectById} from "./Components/Util/ObjectUtil";
import DrawBoard from "./Components/DrawBoard/DrawBoard";
import {createConnection} from "./ConnectionCreationRules";
import {createSelection} from "./ErRules/ErDrawingRuleEnforcer";
import {ConnectionType, DiagramTypes} from "./Model/Diagram";


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


    //Adding the default display name based on this counter
    const [counter, setCounter] = useState(0);

    //The currently selected object id, or null
    const [selectedObjectId, setSelectedObjectId] = useState(null);

    //The current ActionState, representing the current user action
    const [actionState, setActionState] = useState(ACTIONSTATE.Default);

    //This state only indicate which kind of connection should be added
    const [connectionInformation, addConnectionInformation] = useState(ConnectionType.association)

    /**
     * Method to change the current ActionState
     *
     * @param state The state to change to
     * @param connectionType Optional definition of connection type to add
     *
     * @see ACTIONSTATE
     * @see ConnectionType
     */
    const changeActionState = (state, connectionType) => {

        if(state == null) return;
        if(connectionType == null) connectionType = ConnectionType.association;

        setActionState(state);
        addConnectionInformation(connectionType);

    }

    /**
     * Synchronize data with parent for download and transformation
     */
    useEffect( () => {
        syncRelContent(drawBoardElements);
    },[drawBoardElements])

    console.log("State in relational manager")
    console.log(drawBoardElements)
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

            triggerImportComplete()
        }

    },[importedContent, triggerImportComplete])

    const onCanvasSelected = () => {

        return;
        if(selectedObjectId == null) return;

        const newElementState = unselectPreviousElement(connections, drawBoardElements);
        setSelectedObjectId(null);

        changeActionState(ACTIONSTATE.Default);

        setElementState(newElementState.type, newElementState.elements)

    }

    const setElementState = (type, elements) => {

        if (type === OBJECTTYPE.Connection)
            setConnections( () => [
                ...elements
            ])

        if(type === OBJECTTYPE.DrawBoardElement)
            setDrawBoardElements(() => [
                ...elements
            ])

    }

    const onDrawBoardElementSelected = (drawBoardElementId) => {

        return;
        //click on draw board element
        let selectedObject = drawBoardElements.find(element => element.id === drawBoardElementId);

        if(selectedObject == null) return;


        if( actionState === ACTIONSTATE.Default) {

            if(selectedObjectId == null){

                const updatedElements = selectElement(drawBoardElements, drawBoardElementId)

                setElementState(OBJECTTYPE.DrawBoardElement, updatedElements)

                setSelectedObjectId(selectedObject.id);

            }
            else{

                const unselectedElements = unselectPreviousElement(connections, drawBoardElements);

                if(unselectedElements.type === OBJECTTYPE.Connection){
                    setElementState(OBJECTTYPE.Connection, unselectedElements.elements)

                    const updatedElements = selectElement(drawBoardElements, drawBoardElementId)
                    setElementState(OBJECTTYPE.DrawBoardElement, updatedElements)
                }

                if(unselectedElements.type === OBJECTTYPE.DrawBoardElement){

                    const updatedElements = selectElement(unselectedElements.elements, drawBoardElementId)
                    setElementState(OBJECTTYPE.DrawBoardElement, updatedElements)

                }


                setSelectedObjectId(selectedObject.id);
            }



        }


        if( actionState === ACTIONSTATE.AddConnection) {

            //Only allow new connections on highlighted elements
            if(selectedObject.isHighlighted === false) return;

            changeActionState(ACTIONSTATE.Default)

            let previousSelectedObject = selectedObjectId;
            setSelectedObjectId(null);

            const unselectedElements = unselectPreviousElement(connections, drawBoardElements);

            if(unselectedElements.type === OBJECTTYPE.Connection) return;

            //Selected Object ID is the previously selected element
            addConnection(previousSelectedObject,drawBoardElementId, connectionInformation)

            setDrawBoardElements(() => [
                ...unselectedElements.elements
            ])

        }

    };


    const onConnectionSelected = (connectionId) => {


        if( actionState === ACTIONSTATE.Default ||
            actionState === ACTIONSTATE.AddConnection) {

            let connection = connections.find(connection => connection.id === connectionId)
            setSelectedObjectId(connection.id);


            if(selectedObjectId == null){

                const updatedConnections = selectElement(connections, connectionId)
                setConnections(() => [
                    ...updatedConnections
                ])

                return;
            }


            const unselectedElements = unselectPreviousElement(connections, drawBoardElements);

            if(unselectedElements.type === OBJECTTYPE.Connection) {

                const updatedConnections = selectElement(unselectedElements.elements, connectionId)
                setConnections(() => [
                    ...updatedConnections
                ])

                return;
            }



            if(unselectedElements.type === OBJECTTYPE.DrawBoardElement){
                setElementState(OBJECTTYPE.DrawBoardElement, unselectedElements.elements)

                const updatedConnections = selectElement(connections, connectionId)
                setConnections(() => [
                    ...updatedConnections
                ])


            }

        }

    };



    const addDrawBoardElement = (e) => {

        let erType = e.dataTransfer.getData('erType');

        if (Object.keys(ERTYPE).includes(erType)){

            let newId = erType + "--" + Date.now();

            //The currentTarget needs to be used instead of the e.target, to always receive the
            //element which has the handler on the event installed
            //With e.target the target can be set to a sub element of the svg, when dropping over it
            //therefore the x and y coordinates would be relative to the sub element instead of the svg
            let { x, y } = e.currentTarget.getBoundingClientRect();

            let newDrawBoardElement = {
                id: newId,
                displayName: "new "+ erType + " " + counter,
                isHighlighted: false,
                isSelected: false,
                x: e.clientX - x - 50,
                y: e.clientY - y - 50,
                width: 150,
                height: 100,
                objectType: OBJECTTYPE.DrawBoardElement,
                erType: erType,
                isMerging: true,
                owningSide: null
            };

            setDrawBoardElements([
                ...drawBoardElements,
                newDrawBoardElement]);

            setCounter(counter+1);

            e.stopPropagation();
        }


    };


    /**
     * Function given to DrawBoardElement to update the position in the state
     * @param elementId The id of the element
     * @param x The x coordinate of the element
     * @param y The y coordinate of the element
     * @see DrawBoardElement
     */
    const updateDrawBoardElementPosition = (elementId, x, y) => {

        console.log("update position rel")
        console.log(x)
        console.log(y)
        console.log(elementId)
        let element = drawBoardElements.find(element => element.id === elementId)

        let otherElements = drawBoardElements.filter(element => !(element.id === elementId))

        let clone = Object.assign({}, element)
        clone.x = x;
        clone.y = y;

        console.log(clone)
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

    const removeElement = (id) => {


        let elementsToUpdate = drawBoardElements;
        let connectionsToUpdate = connections;

        let selectedObject = resolveObjectById(id, elementsToUpdate, connectionsToUpdate)

        if(selectedObject.objectType === OBJECTTYPE.Connection) {

            console.log("Remove connection")
            console.log(connectionsToUpdate)
            connectionsToUpdate = removeConnectionDirect(selectedObject, connectionsToUpdate)
            console.log("after remove connection")
            console.log(connectionsToUpdate)
        }
        if(selectedObject.objectType === OBJECTTYPE.DrawBoardElement){

            const updatedObjects = removeDrawBoardElement(selectedObject.id, elementsToUpdate, connectionsToUpdate)
            elementsToUpdate = updatedObjects.updatedDrawBoardElements;
            connectionsToUpdate = updatedObjects.updatedConnections;

        }

        const newElementState = unselectElements(connectionsToUpdate, elementsToUpdate);

        setSelectedObjectId(null);

        changeActionState(ACTIONSTATE.Default);

        elementsToUpdate = newElementState.elements;
        connectionsToUpdate = newElementState.connections;

        setElementState(OBJECTTYPE.DrawBoardElement, elementsToUpdate)
        setElementState(OBJECTTYPE.Connection, connectionsToUpdate)

    }

    const removeDrawBoardElement = (elementId, drawBoardElements, connections) => {

        const updatedConnections = connections.filter(connection => !(connection.start === elementId || connection.end === elementId))
        const updatedDrawBoardElements = drawBoardElements.filter((element) => !(element.id === elementId))

        return {updatedConnections: updatedConnections,
            updatedDrawBoardElements: updatedDrawBoardElements}
    }

    const removeConnectionDirect = (connectionToRemove, connections) => {

        return connections.filter((connection)=>!(connectionToRemove.id === connection.id))

    }


    const addConnection = (idStart, idEnd, connectionInformation) => {

        let newConnection = createConnection(drawBoardElements, idStart, idEnd, connectionInformation);

        setConnections((prevState) => [
            ...prevState,
            newConnection
        ])
    }

    const unselectElements = (connections, drawBoardElements) => {
        const unselectedElements = setElementNotSelectedNotHighlighted(null, drawBoardElements)
        const unselectedConnections = setElementNotSelectedNotHighlighted(null, connections)

        return {elements: unselectedElements, connections: unselectedConnections}
    }

    const unselectPreviousElement = (connections, drawBoardElements) => {

        let selectedObject = resolveObjectById(selectedObjectId, connections, drawBoardElements);

        if(selectedObject.objectType === OBJECTTYPE.Connection)
            return { type: OBJECTTYPE.Connection,
                elements: setElementNotSelectedNotHighlighted(selectedObjectId, connections)}
        else
            return { type: OBJECTTYPE.DrawBoardElement,
                elements: setElementNotSelectedNotHighlighted(selectedObjectId, drawBoardElements)}

    }

    const setElementNotSelectedNotHighlighted = (id, elements) => {

        return elements.map(element => {
            if (element.id === id) return {...element, isSelected: false, isHighlighted: false}
            return {...element, isHighlighted: false}
        });

    }


    const setElementMergeProperty = (id, elements, shouldMerge) => {

        return elements.map(element => {
            if (element.id === id) return {...element, isMerging: shouldMerge}
            return {...element}
        });
    }

    const setElementOwningSideProperty = (id, elements, owningSideId) => {

        return elements.map(element => {
            if (element.id === id) return {...element, owningSide: owningSideId}
            return {...element}
        });
    }

    const setMergeProperty = (selectedRelationId, shouldMerge) => {

        let elements = setElementMergeProperty(selectedRelationId, drawBoardElements, shouldMerge);

        setDrawBoardElements(() => [
            ...elements
        ])

    }

    const setOwningSideProperty = (selectedRelationId, owningElementId) => {

        let elements = setElementOwningSideProperty(selectedRelationId, drawBoardElements, owningElementId)

        setDrawBoardElements(() => [
            ...elements
        ])
    }

    const selectElement = (elements, id) => {

        let shallowCopy = [...elements];
        let selectedElement = shallowCopy.find(element => element.id === id)
        selectedElement.isSelected = true;

        return[...shallowCopy];

    }

    const setDisplayName = (elementId, value) => {

        let changedElements = drawBoardElements.map( (element) =>  {
            if(element.id === elementId)
                return {...element, displayName: value};
            return element;
        } )


        setDrawBoardElements(( () => [
            ...changedElements
        ]))

    }

    const editConnectionNotation = (connectionId, minMax, notation) => {

        let changedConnection = connections.find(connection => connection.id === connectionId)

        if(minMax === ConnectionCardinality.Min) changedConnection.min = notation;
        if(minMax === ConnectionCardinality.Max) changedConnection.max = notation;

        let clone = Object.assign({}, changedConnection)
        setConnections(( () => [
            ...connections.filter(connection => !(connection.id === connectionId)),
            clone
        ]))

    }



    const toAddConnectionState = (id, type) => {

        changeActionState(ACTIONSTATE.AddConnection, type)

        const selectionElements = createSelection(id, type, drawBoardElements, connections)

        setDrawBoardElements(( () => [
            ...selectionElements
        ]))

    }

    /**
     * All properties, which will be passed to the right bar
     * to perform modifying actions on the diagram
     */
    const rightBarProps = {
        selectedObjectId: selectedObjectId,
        connections: connections,
        drawBoardElements: drawBoardElements,
        removeElement: removeElement,
        setDisplayName: setDisplayName,
        editConnectionNotation: editConnectionNotation,
        toAddConnectionState: toAddConnectionState,
        setMergeProperty: setMergeProperty,
        setOwningSideProperty: setOwningSideProperty
    }


    /**
     * The offset between the canvas and the inner drawBoard
     * The "border" of the background page is set to 30 px offset to the mostOuter and therefore canvas
     */
    const drawBoardBorderOffset = 30;

    return (

        <div>
            <div className="canvasStyle" id="canvas" onClick={() => onCanvasSelected(null)}>
                {/* The left toolbar, containing the elements to drag into the draw board  */}

                {/* The draw board   */}
                <DrawBoard
                    onDropHandler={addDrawBoardElement}
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

                {/* The right bar, used for editing the elements in the draw board */}
                <RightBar {...rightBarProps} />
            </div>
        </div>
    );
};
export default RelationalManager;
