
// A primary
// A primary foreign
// A foreign
// A --
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

const TableUtil = {
    sortColumnsOfTableImmutable: sortColumnsOfTableImmutable
}

export default TableUtil;