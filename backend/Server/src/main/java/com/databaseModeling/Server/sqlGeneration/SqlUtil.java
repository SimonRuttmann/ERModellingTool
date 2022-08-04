package com.databaseModeling.Server.sqlGeneration;

import com.databaseModeling.Server.controller.RelationalModelDto;

import java.util.List;

public class SqlUtil {


    public static RelationalModelDto.DrawBoardContent.TableDTO
    GetTableForId(List<RelationalModelDto.DrawBoardContent.TableDTO> tables, String id){

        return tables.stream().filter(table -> table.getColumns().stream().anyMatch(column -> column.getId().equals(id))).findFirst().orElseThrow();
    }


    public static RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO
    GetColumnForId(RelationalModelDto.DrawBoardContent.TableDTO referencedTable, String id) {

        return referencedTable.getColumns().stream().filter(column -> column.getId().equals(id)).findFirst().orElseThrow();
    }

    public static String getSpaceLessDisplayName(String displayName){
        return displayName.replace(" ", "_");
    }

}
