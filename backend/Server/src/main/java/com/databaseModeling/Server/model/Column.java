package com.databaseModeling.Server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public final class Column {

    private String id;
    private String originDisplayName;
    private String newDisplayName;

    private boolean isPrimaryKey;

    private Key key = new Key(false, false, null);

    public boolean isForeignKey(){
        return key.isForeignKey;
    }

    public boolean isPrimaryKey(){
        return key.isPrimaryKey;
    }

    public Key getKey(){
        return key;
    }

    public Column(String id, String originDisplayName, Key key) {
        this.originDisplayName = originDisplayName;
        this.key = key;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Key{
        private Boolean isPrimaryKey;
        private Boolean isForeignKey;
        private String referencesId;
    }

}
