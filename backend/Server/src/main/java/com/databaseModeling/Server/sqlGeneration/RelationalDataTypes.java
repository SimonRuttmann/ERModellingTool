package com.databaseModeling.Server.sqlGeneration;

/**
 * Represents the data types available in the relational model
 */
public enum RelationalDataTypes {
    Integer("int"),
    Float("float"),
    Boolean("boolean"),
    Text("varchar(255)"),
    Date("date"),
    Timestamp("timestamp");

    public final String sqlType;

    RelationalDataTypes (String sqlType){
        this.sqlType = sqlType;
    }
}
