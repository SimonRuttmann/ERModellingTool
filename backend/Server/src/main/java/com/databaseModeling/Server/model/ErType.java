package com.databaseModeling.Server.model;

public enum ErType {
    StrongEntity(true),
    WeakEntity(true),
    StrongRelation(true),
    IdentifyingRelation(true),
    IsAStructure(true),
    IdentifyingAttribute(false),
    WeakIdentifyingAttribute(false),
    NormalAttribute(false),
   // CompoundAttribute(false),
    MultivaluedAttribute(false);

    public final boolean isNode;

    private ErType (boolean isNode){
        this.isNode = isNode;
    }
}
