package com.databaseModeling.Server.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableDTO {

    private String id;
    private String displayName;
    private String x;
    private String y;
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

