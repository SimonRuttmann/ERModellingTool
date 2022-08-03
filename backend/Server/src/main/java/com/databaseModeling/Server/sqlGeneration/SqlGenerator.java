package com.databaseModeling.Server.sqlGeneration;

import com.databaseModeling.Server.controller.Controller;
import com.databaseModeling.Server.controller.RelationalModelDto;

import java.util.List;

public class SqlGenerator {

    public static String generateSqlForTable(RelationalModelDto.DrawBoardContent.TableDTO table, List<RelationalModelDto.DrawBoardContent.TableDTO> allTables){
        StringBuilder tableDefinition = new StringBuilder();

        //Add header
        tableDefinition.append("CREATE TABLE IF NOT EXISTS [")
           .append(table.getDisplayName())
           .append("] (\n");

        //Add column definitions
        for(var column : table.getColumns()){
            tableDefinition.append(createColumnDefinition(column));
        }

        //Add primary key constraints
        tableDefinition.append(createPrimaryKeyConstraint(table));

        //Add foreign key constraints
        for(var column : table.getColumns()){
            tableDefinition.append(createForeignKeyConstraint(column, allTables));
        }

        //Add footer
        tableDefinition.append(");");

        return tableDefinition.toString();
    }

    private static RelationalDataTypes getDataType(RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO column){
        var dataType = column.getDataType();
        if(dataType == null) dataType = RelationalDataTypes.Integer;
        return dataType;
    }

    protected static String createPrimaryKeyConstraint(RelationalModelDto.DrawBoardContent.TableDTO table){

        StringBuilder primaryKeyConstraint = new StringBuilder();
        primaryKeyConstraint.append("\tPRIMARY KEY (");

        boolean firstTime = true;
        for(var column : table.getColumns()){
            if(column.isPrimaryKey() && firstTime) {
                primaryKeyConstraint.append(getSpaceLessDisplayName(column.getDisplayName()));
                firstTime = false;
            }
            else if(column.isPrimaryKey())
                primaryKeyConstraint.
                        append(",").
                        append(getSpaceLessDisplayName(column.getDisplayName()));
        }

        primaryKeyConstraint.append("),\n");
        return primaryKeyConstraint.toString();
    }

    protected static String createForeignKeyConstraint(RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO column,
                                                       List<RelationalModelDto.DrawBoardContent.TableDTO> tables){

        StringBuilder foreignKeyConstraint = new StringBuilder();
        if(column.isForeignKey()){
            var referencedTable = Controller.GetTableForId(tables, column.getForeignKeyReferencedId());
            var referencedColumn = Controller.GetColumnForId(referencedTable, column.getForeignKeyReferencedId());
            foreignKeyConstraint.
                    append("\tFOREIGN KEY (").
                    append(getSpaceLessDisplayName(column.getDisplayName())).
                    append(") REFERENCES [").
                    append(getSpaceLessDisplayName(referencedTable.getDisplayName())).
                    append("].").
                    append(getSpaceLessDisplayName(referencedColumn.getDisplayName())).
                    append(",\n");
        }

        return foreignKeyConstraint.toString();
    }

    protected static String createColumnDefinition(RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO column){
        return getSpaceLessDisplayName("\t" + column.getDisplayName()) + " " + getDataType(column).sqlType + ",\n";
    }

    protected static String getSpaceLessDisplayName(String displayName){
        return displayName.replace(" ", "_");
    }

}
