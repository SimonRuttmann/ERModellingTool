package com.databaseModeling.Server.model;

import com.databaseModeling.Server.services.AssociationType;
import com.databaseModeling.Server.services.Cardinality;

public class EntityRelationAssociation {


    private final String min;
    private final String max;

    public String getMin() {return min;}

    public String getMax() {return max;}

    private Cardinality cardinality;

    public void setCardinality(Cardinality cardinality) {
        this.cardinality = cardinality;
    }

    public Cardinality getCardinality(){
        return cardinality;
    }

    private AssociationType associationType;

    public AssociationType getAssociationType() {
        return associationType;
    }

    public void setAssociationType(AssociationType associationType) {
        this.associationType = associationType;
    }

    public ElementMetaInformation elementMetaInformation;

    public EntityRelationAssociation(String min, String max, ElementMetaInformation elementMetaInformation) {
        this.min = min;
        this.max = max;
        this.elementMetaInformation = elementMetaInformation;
    }

    private Table table;

    public void setTable(Table table){
        this.table = table;
    }

    public Table getTable(){
        return table;
    }
}
