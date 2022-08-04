package com.databaseModeling.Server.model.relationalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.conceptionalModel.ErType;

/**
 * Factory for creating and registering tables based on the entity relationship element type
 */
public class TableFactory {

    /**
     * Creates a new table instance based on the entity relationship element
     * @param erType The entity relationship element to create a table for
     * @param elementMetaInformation Additional meta information which will be added to the table
     * @param tableRegister The register instance, where the table will be added to
     * @return The created table
     * @see Table
     */
    public static Table createTable(ErType erType, ElementMetaInformation elementMetaInformation, TableRegister tableRegister){

        if(erType == ErType.IsAStructure) return null;

        Table table = new Table(elementMetaInformation);
        table.setOriginDisplayName(elementMetaInformation.getDisplayName());
        var registerId = tableRegister.registerTable(table);

        var columnId = generateColumnId(registerId, table.getColumns().size());
        Column column = new Column();
        column.setId(columnId);
        column.setColumnName(elementMetaInformation.getDisplayName());

        if(erType == ErType.WeakEntity) table.setWeakEntityTable(true);

        //If it is no attribute, we return the table without columns
        switch (erType){
            case StrongEntity:
            case WeakEntity:
            case StrongRelation:
            case WeakRelation:
                return table;
        }

        //Mark column as primary key
        switch (erType){
            case IdentifyingAttribute:
            case WeakIdentifyingAttribute:  column.getKey().setIsPrimaryKey(true);
        }

        table.addColumn(column);

        return table;
    }

    public static String generateColumnId(String tableId, int columnNo){
        return tableId + " Column -- " + columnNo;
    }


}
