package com.databaseModeling.Server.sqlGeneration;

import com.databaseModeling.Server.controller.RelationalModelDto;


public class RelationalModelToSqlTranslator {


    public String translate(RelationalModelDto relationalModel){

        //Create topological sort and add tables as nodes and connections (foreign keys) as edges
        var topologicalSort = new TopologicalSort<RelationalModelDto.DrawBoardContent.TableDTO>();

        var tables = relationalModel.getDrawBoardContent().getTables();
        for (var table : relationalModel.getDrawBoardContent().getTables()) {
            topologicalSort.addNode(table);
        }

        for (var connection : relationalModel.getDrawBoardContent().getConnections()){
            topologicalSort.addEdge(SqlUtil.GetTableForId(tables, connection.getStart()), SqlUtil.GetTableForId(tables, connection.getEnd()));
        }

        //Execute topological sort
        var success = topologicalSort.topologicalSort();
        var resultSet = topologicalSort.resolveResultSet();

        //Create sql for each table
        StringBuilder sql = new StringBuilder();
        if(!success){
            sql.append("Circular dependencies between the sql tables through foreign key constraints detected!\n\n");
        }

        for(var table : resultSet){
            sql.append(SqlGenerator.generateSqlForTable(table, resultSet));
            sql.append("\n\n");
        }

        return sql.toString();
    }
}
