package com.databaseModeling.Server.model.conceptionalModel;

/**
 * Represents the concrete type for an Er element
 * Also hold information if the element is hold in a graph node or tree node
 */
public enum ErType {
    StrongEntity(true, "Strong Entity"),
    WeakEntity(true, "Weak Entity"),
    StrongRelation(true, "Strong Relation"),
    WeakRelation(true, "Weak Relation"),
    IsAStructure(true, "Is A Structure"),
    IdentifyingAttribute(false, "Identifying Attribute"),
    WeakIdentifyingAttribute(false, "Weak identifying Attribute"),
    NormalAttribute(false, "Normal Attribute"),
    MultivaluedAttribute(false, "Multivalued Attribute");

    public final boolean isNode;
    public final String displayName;

    ErType (boolean isNode, String displayName){
        this.isNode = isNode;
        this.displayName = displayName;
    }
}
