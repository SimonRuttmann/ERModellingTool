package com.databaseModeling.Server.model;

import com.databaseModeling.Server.controller.RelationalModelDto;
import com.databaseModeling.Server.model.relationalModel.Column;
import com.databaseModeling.Server.model.relationalModel.Table;

import java.util.List;
import java.util.stream.Collectors;

public class TableDtoFactory {

    public static RelationalModelDto.DrawBoardContent.TableDTO createTableDto(Table table){
        var dto = new RelationalModelDto.DrawBoardContent.TableDTO();
        dto.setId(table.getId());
        dto.setDisplayName(table.getOriginDisplayName());
        dto.setX(table.getMetaInformation().getXPos());
        dto.setY(table.getMetaInformation().getYPos());
        dto.setColumns(createColumnDto(table.getColumns()));

        return dto;
    }

    public static List<RelationalModelDto.DrawBoardContent.TableDTO> createTableDto(List<Table> tables){
        return tables.stream().map(TableDtoFactory::createTableDto).collect(Collectors.toList());
    }

    private static RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO createColumnDto(Column column){
        var dto = new RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO();
        dto.setId(column.getId());
        dto.setDisplayName(column.getColumnName());
        dto.setPrimaryKey(column.isPrimaryKey());
        dto.setForeignKey(column.isForeignKey());
        dto.setForeignKeyReferencedId(column.getKey().getReferencesId());
        return dto;
    }

    private static List<RelationalModelDto.DrawBoardContent.TableDTO.ColumnDTO> createColumnDto(List<Column> columns){
        return columns.stream().map(TableDtoFactory::createColumnDto).collect(Collectors.toList());
    }
}
