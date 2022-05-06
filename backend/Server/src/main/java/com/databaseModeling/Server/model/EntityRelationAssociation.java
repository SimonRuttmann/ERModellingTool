package com.databaseModeling.Server.model;

public class EntityRelationAssociation {


    private final String min;
    private final String max;

    public String getMin() {return min;}

    public String getMax() {return max;}

    public ElementMetaInformation elementMetaInformation;

    public EntityRelationAssociation(String min, String max, ElementMetaInformation elementMetaInformation) {
        this.min = min;
        this.max = max;
        this.elementMetaInformation = elementMetaInformation;
    }
}
