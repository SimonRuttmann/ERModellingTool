
// noinspection JSUnresolvedVariable, Justification variables are resolved

/**
 * Sorts the columns for a table in the following order
 * Primary Key -> Primary Key + Foreign Key -> Foreign key -> Normal Column
 * @param table The table to sort the columns for
 * @returns {*[]} A collection of sorted columns
 */
const sortColumnsOfTableImmutable = (table) => {

    return [...table.columns].sort( (a,b) => {
        if( a.primaryKey &&  b.primaryKey) {

            if( a.foreignKey &&  b.foreignKey) return  0;
            if( a.foreignKey && !b.foreignKey) return +1;
            if(!a.foreignKey &&  b.foreignKey) return -1;
            if(!a.foreignKey && !b.foreignKey) return  0;

        }
        if( a.primaryKey && !b.primaryKey) return -1;
        if(!a.primaryKey &&  b.primaryKey) return +1;
        if(!a.primaryKey && !b.primaryKey){

            if( a.foreignKey &&  b.foreignKey) return  0;
            if( a.foreignKey && !b.foreignKey) return -1;
            if(!a.foreignKey &&  b.foreignKey) return +1;
            if(!a.foreignKey && !b.foreignKey) return  0;

        }
        return 0;
    });

}

/**
 * A collection of utility functions for tables
 */
const TableUtil = {
    sortColumnsOfTableImmutable: sortColumnsOfTableImmutable
}

export default TableUtil;