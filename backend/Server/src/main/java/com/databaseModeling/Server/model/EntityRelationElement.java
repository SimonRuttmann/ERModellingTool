package com.databaseModeling.Server.model;

import com.databaseModeling.Server.services.TableManager;

public class EntityRelationElement {

    private final ErType erType;
    public ErType getErType() { return erType; }


    private final ElementMetaInformation elementMetaInformation;
    public ElementMetaInformation getElementMetaInformation() {return elementMetaInformation;}

    private Table table = TableManager.createTable(this);

    public Table getTable(){return table;}
    public void setTable(Table table){this.table = table;}

    public boolean hasTable(){
        return table != null;
    }

    public void removeTable(){
        this.table = null;
    }
    public EntityRelationElement(ErType erType, ElementMetaInformation elementMetaInformation) {
        this.erType = erType;
        this.elementMetaInformation = elementMetaInformation;
    }


}
