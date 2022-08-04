package com.databaseModeling.Server.model.conceptionalModel;

/**
 * Represents the cardinality between one entity and one relation
 */
public enum Cardinality {
    MandatoryOne(true),
    OptionalOne(true),
    Many(false);

    private final boolean isSingleOrLess;

    public boolean isSingleOrLess(){return isSingleOrLess;}
    public boolean isMultipleCardinality(){return !isSingleOrLess;}

    Cardinality(boolean isSingleOrLess){this.isSingleOrLess = isSingleOrLess;}
}
