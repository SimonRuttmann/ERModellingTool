import {createSlice} from "@reduxjs/toolkit";
import {ConnectionCardinality} from "../Services/DrawBoardModel/ActionState";

/**
 * This ReduxStore is responsible for holding drawBoardElements and connections in the context of entity-relationship diagrams.
 * DrawBoardElements represent Er-Elements like StrongEntities, MultivaluedAttributes, IsAs, ...
 * Connections are between those DrawBoardElements and hold data like min/max Cardinality,
 * inheritor/parent of IsAs connected to entities ...
 *
 * @example
 * The drawBoardElement has the following structure
 *     id:            string            The id of this element
 *     displayName:   string            The name of the element displayed to the user
 *     isHighlighted: boolean           Flag indicating if the element should be displayed as highlighted
 *     isSelected:    boolean           Flag indicating if the element should be displayed as selected
 *     x:             double            The x coordinate on the draw field
 *     y:             double            The y coordinate on the draw field
 *     width:         double            The current width of the element
 *     height:        double            The current height of the element
 *     objectType:    ObjectType        The object type. Here ObjectType.DrawBoardElement
 *     erType:        ErType            E.g. StrongEntity
 *     owningSide:    string            Only applies to strong relations, it is an id for an entity
 *
 * @example
 * The connection has the following structure
 *     id:             string           The id of this connection
 *     start:          string           The id of a draw board element to start form
 *     end:            string           The id of a draw board element to end at
 *     min:            string           The min cardinality
 *     max:            string           The max cardinality
 *     objectType:     ObjectType       The object type. Here ObjectType.Connection
 *     isSelected:     boolean          Flag indicating if the connection should be displayed as selected
 *     withArrow:      boolean          Flag indicating if the connection should have an arrow to the end element
 *     withLabel:      boolean          Flag indicating if the connection should have a label
 *     connectionType: ConnectionType   The kind of connection. Isa-Parent, AttributeConnector etc.
 */
const erContentSlice = createSlice({
    name: 'erContent',
    initialState: {drawBoardElements: [], connections: []},
    reducers: {
        /**
         * Sets the current state to the given drawBoardElements and connections
         * @payload action.payload.drawBoardElements The drawBoardElements to set the state to
         * @payload action.payload.connections The connections to set the state to
         */
        ImportErContent: (state, action) => {
            let content = action.payload;

            let drawBoardElements = content.drawBoardContent.drawBoardElements;
            let connections = content.drawBoardContent.connections;
            state.drawBoardElements = [];
            state.connections = [];

            drawBoardElements = drawBoardElements.map(drawBoardElements => {
                return {...drawBoardElements, isHighlighted: false, isSelected: false}
            })

            //action.payload.drawBoardContent
            if(Array.isArray(drawBoardElements) )
            {
                drawBoardElements.forEach( element => state.drawBoardElements.push(element))
            }

            if(Array.isArray(connections) )
            {
                connections.forEach(connection => state.connections.push(connection))
            }
            return state;
        },
        /**
         * Sets the select property of a connection or drawBoardElement
         * @payload action.payload.id The id of a connection or drawBoardElement
         */
        SelectAnyElement: (state, action) => {
            let id = action.payload.id;

            //Resolve selected object
            let element = state.drawBoardElements.find(element => element.id === id);
            let connection = state.connections.find(connection => connection.id === id);

            //Select connection
            if(element == null){
                connection.isSelected = true;
            }
            //Select drawBoardElement
            else{
                element.isSelected = true;
            }

            return state;
        },
        /**
         * Sets the highlight property for each drawBoardElement id inside the given array
         * @payload action.payload.idsToHighlight An array of id`s
         */
        HighlightDrawBoardElements: (state, action) => {
            let ids = action.payload.idsToHighlight;

            state.drawBoardElements = state.drawBoardElements.map(element => {
                let isHighlighted = false;

                if(ids.indexOf(element.id) !== -1)  isHighlighted = true;

                return {...element, isHighlighted: isHighlighted}
            });

            return state;
        },
        /**
         * Sets the select property for all connections and draw board elements
         * Also set the highlight flags to false all elements
         */
        UnselectAndUnHighlightAllElements: (state) => {

            state.connections = state.connections.map(element => {
                return {...element, isSelected: false, isHighlighted: false}
            });

            state.drawBoardElements = state.drawBoardElements.map(element => {
                return {...element, isSelected: false, isHighlighted: false}
            });

            return state;
        },
        /**
         * Adds a new element to the state
         * @payload action.payload.newElement The element to add
         */
        AddDrawBoardElement: (state, action) => {
            let newElement = action.payload.newElement;

            state.drawBoardElements.push({
                id: newElement.id,

                displayName: newElement.displayName,
                isHighlighted: newElement.isHighlighted,
                isSelected: newElement.isSelected,

                x: newElement.x,
                y: newElement.y,
                width: newElement.width,
                height: newElement.height,

                objectType: newElement.objectType,
                erType: newElement.erType,
                owningSide: newElement.owningSide,
            });

           return state;
        },
        /**
         * Removes a draw board element
         * Also removes all connections to and from this element
         * @payload action.payload.id The id of the draw board element to remove
         */
        RemoveDrawBoardElement: (state, action) => {
            let id = action.payload.id;

            state.connections = state.connections.filter(connection => !(connection.start === id || connection.end === id))
            state.drawBoardElements = state.drawBoardElements.filter(element => !(element.id === id))

            return state;
        },
        /**
         * Updates the size of a draw board element
         * @payload action.payload.id The id of the draw board element to update the size
         * @payload action.payload.height The new height of the draw board element
         * @payload action.payload.width The new width of the draw board element
         */
        UpdateDrawBoardElementSize: (state, action) => {
            let id = action.payload.id;
            let width = action.payload.width;
            let height = action.payload.height;

            let element = state.drawBoardElements.find(element => element.id === id);
            element.width = width;
            element.height = height;

            return state;
        },
        /**
         * Updates the position of a draw board element
         * @payload action.payload.id The id of the draw board element to update the position
         * @payload action.payload.x The new x position of the draw board element
         * @payload action.payload.y The new y position of the draw board element
         */
        UpdateDrawBoardElementPosition: (state, action) => {
            let id = action.payload.id;
            let x = action.payload.x;
            let y = action.payload.y;

            let element = state.drawBoardElements.find(element => element.id === id);
            element.x = x;
            element.y = y;

            return state;
        },
        /**
         * Updates the owningSide of a draw board element
         * @payload action.payload.id The id of the draw board element to update the owning side
         * @payload action.payload.owningSide The id of another draw board element
         */
        SetDrawBoardElementOwningSide: (state, action) => {
            let selectedElementId = action.payload.id;
            let owningElementId = action.payload.owningSide;

            let element = state.drawBoardElements.find(element => element.id === selectedElementId);
            element.owningSide = owningElementId;

            return state;
        },
        /**
         * Updates the display name of a draw board element
         * @payload action.payload.id The id of the draw board element to update the display name
         * @payload action.payload.displayName The new display name
         */
        SetDrawBoardElementDisplayName: (state, action) => {
            let id = action.payload.id;
            let displayName = action.payload.displayName;

            let element = state.drawBoardElements.find(element => element.id === id);
            element.displayName = displayName;

            return state;
        },
        /**
         * Adds a new connection to the state
         * @payload action.payload.newConnection The connection to add
         */
        AddConnection: (state, action) => {
            let newConnection = action.payload.newConnection;

            state.connections.push({
                id: newConnection.id,
                start: newConnection.start,
                end: newConnection.end,
                min: newConnection.min,
                max: newConnection.max,
                objectType: newConnection.objectType,
                isSelected: newConnection.isSelected,
                withArrow: newConnection.withArrow,
                withLabel: newConnection.withLabel,
                connectionType: newConnection.connectionType
            });

            return state;
        },
        /**
         * Removes a connection
         * @payload action.payload.id The id of the connection to remove
         */
        RemoveConnection: (state, action) => {
            let id = action.payload.id;

            state.connections = state.connections.filter(element => !(element.id === id))

            return state;
        },
        /**
         * Updates the cardinality of a connection
         * @payload action.payload.id The id of the connection
         * @payload action.payload.notation The new notation value e.g. "1" or "A"
         * @payload action.payload.minMax The kind of notation. Cardinality.Min or Cardinality.Max
         */
        UpdateConnectionNotation: (state, action) => {
            let id = action.payload.id;
            let notation = action.payload.notation;
            let minMax = action.payload.minMax;

            let connection = state.connections.find(connection => connection.id === id)

            if(minMax === ConnectionCardinality.Min) connection.min = notation;
            if(minMax === ConnectionCardinality.Max) connection.max = notation;

            return state;
        },
    }
})

export const {
    ImportErContent,
    SelectAnyElement,
    HighlightDrawBoardElements,
    UnselectAndUnHighlightAllElements,
    AddDrawBoardElement,
    RemoveDrawBoardElement,
    UpdateDrawBoardElementSize,
    UpdateDrawBoardElementPosition,
    SetDrawBoardElementOwningSide,
    SetDrawBoardElementDisplayName,
    AddConnection,
    RemoveConnection,
    UpdateConnectionNotation} = erContentSlice.actions;

export default erContentSlice.reducer;
export const selectErContentSlice = (state) => state.erContent;