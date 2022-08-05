package com.databaseModeling.Server.sqlGeneration;

import com.databaseModeling.Server.controller.RelationalModelDto;

import java.util.List;

/**
 * Utility class to resolve references between tables
 */
public class SqlUtil {


    /**
     * Resolves a table with a column that matches a given column id
     * @param tables The tables to search in
     * @param id The column id to search for
     * @return The table, which has a column with this id
     */
    public static RelationalModelDto.DrawBoardContent.TableDTO
    GetTableForId(List<RelationalModelDto.DrawBoardContent.TableDTO> tables, String id){

        return tables.stream().
                filter(table -> table.getColumns().stream().
                        anyMatch(column -> column.getId().equals(id))).
                findFirst().orElseThrow();
    }


    /**
     * Resolves a column in a table for a given column id
     * @param referencedTable The referenced table
     * @param id The id to search for
     * @return The column with the given id
     */
    public static RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO
    GetColumnForId(RelationalModelDto.DrawBoardContent.TableDTO referencedTable, String id) {

        return referencedTable.getColumns().stream().
                filter(column -> column.getId().equals(id)).
                findFirst().orElseThrow();
    }

    public static String getSpaceLessDisplayName(String displayName){
        return displayName.replace(" ", "_");
    }

}
