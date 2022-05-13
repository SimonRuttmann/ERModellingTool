package com.databaseModeling.Server.model.relationalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class TableManager {

    private static final AtomicLong tableIdCounter = new AtomicLong();

    public static Table createTable(ErType erType, ElementMetaInformation elementMetaInformation){

        var tableId = generateTableId();
        Table table = new Table(tableId);

        var columnId = generateColumnId(table);
        Column column = new Column();
        column.setId(columnId);

        switch (erType){
            case IdentifyingAttribute:
            case WeakIdentifyingAttribute:  column.getKey().setIsPrimaryKey(true);
                                            break;
            case NormalAttribute:
            case MultivaluedAttribute:
        }

        column.setOriginDisplayName(elementMetaInformation.getDisplayName());

        return table;
    }

    /**
     * Creates foreign keys, referencing the primary keys of the table
     * The foreign keys will be primary keys
     * @see TableManager#AddForeignKeysToTable(Table, Table, boolean)
     */
    public static void AddForeignKeysToTableAsPrimaryKeys(Table referencedTable, Table referencingTable){
        AddForeignKeysToTable(referencedTable, referencingTable, true);
    }

    /**
     * Creates foreign keys, referencing the primary keys of the table
     * The foreign keys will be normal columns
     * @see TableManager#AddForeignKeysToTable(Table, Table, boolean)
     */
    public static void AddForeignKeysToTableAsNormalColumn(Table referencedTable, Table referencingTable){
        AddForeignKeysToTable(referencedTable, referencingTable, false);
    }


    /**
     * Creates for each primary key of the referenced table a foreign key in the referencing table
     * The reference itself is managed by using the referenced primary keys id
     * @param referencedTable The table which need to be referenced to
     * @param referencingTable The table which references the given table
     * @param withPrimaryKey If true, all created foreign keys will be primary keys in the referencing table
     * @see Table
     * @see Column
     */
    private static void AddForeignKeysToTable(Table referencedTable, Table referencingTable, boolean withPrimaryKey){

        for (var primaryKey : referencedTable.getPrimaryKeys()) {

            Column column = new Column();
            column.setId(generateColumnId(referencingTable));
            column.setOriginDisplayName(primaryKey.getOriginDisplayName());

            column.getKey().setIsForeignKey(true);
            column.getKey().setReferencesId(primaryKey.getId());
            column.getKey().setIsPrimaryKey(withPrimaryKey);

            referencingTable.addColumn(column);
        }
    }


    private static String generateTableId(){
        return tableIdCounter.getAndIncrement() + "-- Table";
    }

    private static String generateColumnId(Table table){
        return table.getId() + " -- Column" + table.getColumns().size();
    }

    public static void AddColumns(Table table, List<Column> columns) {
        columns.forEach(table::addColumn);
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class IdName<T,V> {
        private T id;
        private V name;
    }
}