package com.databaseModeling.Server.dto;

import com.databaseModeling.Server.controller.Controller;
import com.databaseModeling.Server.sqlGeneration.RelationalDataTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * This data transfer object represents the relational model
 * It represents the interface for the controller http endpoints
 * @see Controller#convertToRelational(ConceptionalModelDto)
 * @see Controller#convertToSql(RelationalModelDto)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RelationalModelDto{

    private String projectVersion;
    private String projectName;
    private String projectType;
    private RelationalModelDto.DrawBoardContent drawBoardContent;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DrawBoardContent {

        private List<TableDTO> tables = new ArrayList<>();
        private List<ConnectionDTO> connections = new ArrayList<>();

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class ConnectionDTO {
            private String id;
            private String start;
            private String end;
        }

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class TableDTO {

            private String id;
            private String displayName;
            private double x;
            private double y;
            private List<ColumnDTO> columns = new ArrayList<>();

            @Data
            @AllArgsConstructor
            @NoArgsConstructor
            public static class ColumnDTO {
                private String id;
                private String displayName;
                private boolean isPrimaryKey;
                private boolean isForeignKey;
                private String foreignKeyReferencedId;
                private RelationalDataTypes dataType;
            }
        }
    }
}