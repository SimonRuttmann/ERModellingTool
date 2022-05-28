package com.databaseModeling.Server.model.conceptionalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.relationalModel.Table;
import com.databaseModeling.Server.model.relationalModel.TableManager;

public class EntityRelationElement {

    private boolean isTransformed = false;

    public EntityRelationElement(ErType erType, boolean merging, String owningSide, ElementMetaInformation elementMetaInformation) {
        this.erType = erType;
        this.shouldBeMerged = merging;
        this.owningSide = owningSide;
        this.elementMetaInformation = elementMetaInformation;
        this.table = TableManager.createTable(erType, elementMetaInformation);
    }

    public boolean isTransformed() {
        return isTransformed;
    }

    public void setTransformed(boolean transformed) {
        isTransformed = transformed;
    }

    //Optional! TODO
    private boolean shouldBeMerged = false;

    //Optional! TODO
    private String owningSide;

    public boolean isShouldBeMerged() {
        return shouldBeMerged;
    }

    public void setShouldBeMerged(boolean shouldBeMerged) {
        this.shouldBeMerged = shouldBeMerged;
    }

    public String getOwningSide() {
        return owningSide;
    }

    public boolean hasOwningSide(){
        return owningSide != null && !owningSide.isEmpty() && !owningSide.isBlank();
    }
    public void setOwningSide(String owningSide) {
        this.owningSide = owningSide;
    }

    private ErType erType;
    public ErType getErType() { return erType; }
    public void setErType(ErType erType) {
        this.erType = erType;
    }

    private final ElementMetaInformation elementMetaInformation;
    public ElementMetaInformation getElementMetaInformation() {return elementMetaInformation;}

    private Table table;

    public Table getTable(){return table;}
    public void setTable(Table table){this.table = table;}

    public boolean hasTable(){
        return table != null;
    }

    public void removeTable(){
        TableManager.unregisterTable(this.table);
        this.table = null;
    }
    public EntityRelationElement(ErType erType, ElementMetaInformation elementMetaInformation) {
        this.erType = erType;
        this.elementMetaInformation = elementMetaInformation;
        this.table = TableManager.createTable(erType, elementMetaInformation);
    }


}
