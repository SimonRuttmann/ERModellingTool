import {createSlice} from "@reduxjs/toolkit";
import {ConnectionCardinality} from "../ERModell/Model/ActionState";

const erContentSlice = createSlice({
    name: 'erContent',
    initialState: {drawBoardElements: [], connections: []},
    reducers: {
        /**
         *
         * @param state
         * @param action
         */
        ImportErContent: (state, action) => {
            //action.payload.drawBoardContent
            if(Array.isArray(action.payload.elements) )
            {
                state = [];
                action.payload.drawBoardElements.forEach( element => state.elements.push(element))
            }

            if(Array.isArray(action.payload.connections) )
            {
                state = [];
                action.payload.connections.forEach(connection => state.connections.push(connection))
            }
            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        SelectAnyElement: (state, action) => {
            let id = action.payload;

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
         *
         * @param state
         * @param action
         */
        HighlightDrawBoardElements: (state, action) => {
            let ids = action.payload;

            state.drawBoardElements = state.drawBoardElements.map(element => {
                let isHighlighted = false;

                if(ids.indexOf(element.id) !== -1)  isHighlighted = true;

                return {...element, isHighlighted: isHighlighted}
            });

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        UnselectAndUnHighlightAllElements: (state) => {  //TODO rename, unselect any element and unhighlight all
            state.connections = state.connections.map(element => {
                return {...element, isHighlighted: false}
            });

            state.drawBoardElements = state.drawBoardElements.map(element => {
                return {...element, isHighlighted: false}
            });

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        AddDrawBoardElement: (state, action) => {
            let newElement = action.payload;

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

                minMax: undefined
            });

           return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        RemoveDrawBoardElement: (state, action) => {
            let id = action.payload;

            state.connections = state.connections.filter(connection => connection.start === id || connection.end === id)
            state.drawBoardElements = state.drawBoardElements.filter(element => element.id === id)

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        UpdateDrawBoardElementSize: (state, action) => {
            let id = action.payload.id;
            let width = action.payload.width;
            let height = action.payload.height;

            let element = state.find(element => element.id === id);
            element.width = width;
            element.height = height;

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        UpdateDrawBoardElementPosition: (state, action) => {
            let id = action.payload.id;
            let x = action.payload.x;
            let y = action.payload.y;

            let element = state.find(element => element.id === id);
            element.x = x;
            element.y = y;

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        SetDrawBoardElementOwningSide: (state, action) => {
            let selectedElementId = action.payload.id;
            let owningElementId = action.payload.owningSide;

            let element = state.drawBoardElements.find(element => element.id === selectedElementId);
            element.owningSide = owningElementId;

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        SetDrawBoardElementDisplayName: (state, action) => {
            let id = action.payload.id;
            let displayName = action.payload.displayName;

            let element = state.drawBoardElements.find(element => element.id === id);
            element.displayName = displayName;

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        AddConnection: (state, action) => {
            let newConnection = action.payload;

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
         *
         * @param state
         * @param action
         */
        RemoveConnection: (state, action) => {
            let id = action.payload;

            state.connections = state.connections.filter(element => element.id === id)

            return state;
        },
        /**
         *
         * @param state
         * @param action
         */
        EditConnectionNotation: (state, action) => {
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
    EditConnectionNotation} = erContentSlice.actions;

export default erContentSlice.reducer;
export const selectErContentSlice = (state) => state.erContent;