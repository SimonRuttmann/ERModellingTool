package com.databaseModeling.Server.model.conceptionalModel;

/**
 * Data information for a connection between two Er elements
 * This class is hold in the edges of the Er graph
 */
public class EntityRelationAssociation {

    private final String min;
    public String getMin() {return min;}

    private final String max;
    public String getMax() {return max;}

    private Cardinality cardinality;
    public void setCardinality(Cardinality cardinality) {this.cardinality = cardinality;}
    public Cardinality getCardinality(){return cardinality;}

    private final AssociationType associationType;
    public AssociationType getAssociationType() {return associationType;}

    public EntityRelationAssociation(String min, String max, AssociationType associationType) {
        this.min = min;
        this.max = max;
        this.associationType = associationType;
    }

}
