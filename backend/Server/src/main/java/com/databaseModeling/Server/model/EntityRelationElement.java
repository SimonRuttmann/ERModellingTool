package com.databaseModeling.Server.model;

public class EntityRelationElement {

    private final ErType erType;
    public ErType getErType() { return erType; }


    private final ElementMetaInformation elementMetaInformation;
    public ElementMetaInformation getElementMetaInformation() {return elementMetaInformation;}


    public EntityRelationElement(ErType erType, ElementMetaInformation elementMetaInformation) {
        this.erType = erType;
        this.elementMetaInformation = elementMetaInformation;
    }

}
