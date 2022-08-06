import {createSlice} from "@reduxjs/toolkit";

/**
 * This ReduxStore is responsible for holding drawBoardElements and connections in the context of the relational model
 * DrawBoardElements represent tables, which consist of columns. The table renders all columns itself.
 * Connections are between columns and represent foreign keys
 *
 * @example
 * A drawBoardElement has the following structure
 *    id:          string      The id of the table
 *    displayName: string      The display name of the table
 *    x:           double      The x coordinate of the table
 *    y:           double      The y coordinate of the table
 *    width:       double      The width of the table
 *    height:      double      The height of the table
 *    column:      Column[]    An array of columns, part of this table
 *
 * @example
 * A column has the following structure
 *    id:                          string          The if of the column each column within and between tables is unique
 *    foreignKey:                  boolean         A boolean indicating, if this column is a foreign key column
 *    foreignKeyReferencedId:      string          The id referencing to another column id, only set when the column is a foreign key column
 *    primaryKey:                  boolean         A boolean indicating, if this column is part of the primary key
 *    dataType:                    SqlDataTypes    A value of the enum SqlDataTypes, the default is int.
 *                                                 Every primary and foreign key column has the SqlDataType.int
 * @example
 * A connection has the following structure
 *    id:                          string          The id of this connection
 *    start:                       string          The id of a draw board element to start form
 *    end:                         string          The id of a draw board element to end at
 *    withLabel:                   boolean         Flag indicating if the connection should have a label
 *    horizontalAlignment:         boolean         Flag indicating, that this connection can only connect horizontally to the end and start element
 *    withArrow:                   boolean         Flag indicating if the connection should have an arrow to the end element
 *    isSelected:                  boolean         Flag indicating if the connection should be displayed as selected
 */
const relationalContentSlice = createSlice({
    name: 'relationalContent',
    initialState: {drawBoardElements: [], connections: []},
    reducers: {
        /**
         * Sets the current state to the given drawBoardElements and connections
         * @payload action.payload.drawBoardElements The drawBoardElements to set the state to
         * @payload action.payload.connections The connections to set the state to
         */
        ImportRelContent: (state, action) => {
            let content = action.payload;

            let drawBoardElements = content.drawBoardContent.tables;
            let connections = content.drawBoardContent.connections;
            state.drawBoardElements = [];
            state.connections = [];

            if(Array.isArray(drawBoardElements) )
            {
                drawBoardElements.forEach( element => state.drawBoardElements.push(element))
            }

            if(Array.isArray(connections) )
            {
                connections = connections.map(connection => {
                    return {...connection, withLabel: false, horizontalAlignment: true, withArrow: true, isSelected: false}
                });
                connections.forEach(connection => state.connections.push(connection))
            }

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
         * Updates the dataType of a column
         * @payload action.payload.tableId The id of the table
         * @payload action.payload.columnId The id of the column
         * @payload action.payload.dataType The new dataType, as enum of SqlDataType
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
    ImportRelContent,
    UpdateDrawBoardElementSize,
    UpdateDrawBoardElementPosition,
    ChangeDataTypeOfDrawBoardElement
    } = relationalContentSlice.actions;

export default relationalContentSlice.reducer;
export const selectRelationalContentSlice = (state) => state.relationalContent;