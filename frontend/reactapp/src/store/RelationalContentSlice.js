import {createSlice} from "@reduxjs/toolkit";

const relationalContentSlice = createSlice({
    name: 'relationalContent',
    initialState: {drawBoardElements: [], connections: []},
    reducers: {
        /**
         *
         * @param state
         * @param action
         */
        ImportContent: (state, action) => {
            let drawBoardElements = action.payload.tables;
            let connections = action.payload.connections;

            //action.payload.drawBoardContent
            if(Array.isArray(action.payload.elements) )
            {
                state = [];
                drawBoardElements.forEach( element => state.elements.push(element))
            }

            if(Array.isArray(action.payload.connections) )
            {
                connections = connections.map(connection => {
                    return {...connection, withLabel: false, horizontalAlignment: true, withArrow: true, isSelected: false}
                });
                state = [];
                connections.forEach(connection => state.connections.push(connection))
            }
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
        ChangeDataTypeOfDrawBoardElement: (state, action) => {
            let tableId = action.payload.tableId;
            let columnId = action.payload.columnId;
            let dataType = action.payload.dataType;

            let table = state.drawBoardElements.find(table => table.id === tableId);
            let column = table.columns.find(column => column.id === columnId);
            column.dataType = dataType;

            return state;
        }
    }
})

export const {
    ImportContent,
    UpdateDrawBoardElementSize,
    UpdateDrawBoardElementPosition,
    ChangeDataTypeOfDrawBoardElement
    } = relationalContentSlice.actions;

export default relationalContentSlice.reducer;
export const selectRelationalContentSlice = (state) => state.relationalContent;