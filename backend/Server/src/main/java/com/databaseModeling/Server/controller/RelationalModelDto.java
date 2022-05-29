package com.databaseModeling.Server.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


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

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class TableDTO {

            private String id;
            private String displayName;
            private double x;
            private double y;
            private double width = 0.0;
            private double height = 0.0;
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
            }
        }
    }
}