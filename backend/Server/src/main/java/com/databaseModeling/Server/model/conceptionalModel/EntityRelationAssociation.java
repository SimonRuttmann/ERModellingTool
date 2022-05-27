package com.databaseModeling.Server.model.conceptionalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.relationalModel.Table;

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

    public EntityRelationAssociation(String min, String max, AssociationType associationType) {
        this.min = min;
        this.max = max;
        this.associationType = associationType;
    }

    private Table table;

    public void setTable(Table table){
        this.table = table;
    }

    public Table getTable(){
        return table;
    }
}
