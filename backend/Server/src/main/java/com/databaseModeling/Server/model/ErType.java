package com.databaseModeling.Server.model;

public enum ErType {
    StrongEntity(true, "Strong Entity"),
    WeakEntity(true, "Weak Entity"),
    StrongRelation(true, "Strong Relation"),
    IdentifyingRelation(true, "Identifying Relation"),
    IsAStructure(true, "Is A Structure"),
    IdentifyingAttribute(false, "Identifying Attribute"),
    WeakIdentifyingAttribute(false, "Weak identifying Attribute"),
    NormalAttribute(false, "Normal Attribute"),
   // CompoundAttribute(false),
    MultivaluedAttribute(false, "Multivalued Attribute");

    public final boolean isNode;
    public final String displayName;
    ErType (boolean isNode, String displayName){
        this.isNode = isNode;
        this.displayName = displayName;
    }
}
