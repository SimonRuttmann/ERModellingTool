package com.databaseModeling.Server.model.relationalModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Data representation of a column in a table
 * Columns are explicit created by the table manager (and its factory)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public final class Column {

    private String id;
    private String columnName;

    private Key key = new Key(false, false, null);
    public Key getKey(){return key;}
    public boolean isForeignKey(){return key.isForeignKey;}
    public boolean isPrimaryKey(){return key.isPrimaryKey;}

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Key{
        private Boolean isPrimaryKey;
        private Boolean isForeignKey;
        private String referencesId;
    }

}
