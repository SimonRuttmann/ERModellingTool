package com.databaseModeling.Server.model.conceptionalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.relationalModel.Table;

/**
 * Data information for one Er element
 * This class is hold in the graph and tree nodes of the Er graph
 */
public class EntityRelationElement {

    public EntityRelationElement(ErType erType, String owningSide, ElementMetaInformation elementMetaInformation) {
        this.erType = erType;
        this.owningSide = owningSide;
        this.elementMetaInformation = elementMetaInformation;
    }

    //ER-Data properties
    private final ErType erType;
    public ErType getErType() { return erType; }

    private final ElementMetaInformation elementMetaInformation;
    public ElementMetaInformation getElementMetaInformation() {return elementMetaInformation;}

    //Transformation properties
    private boolean isTransformed = false;
    public boolean isTransformed() {return isTransformed;}
    public void setTransformed(boolean transformed) {isTransformed = transformed;}

    private Table table;
    public void addInitialTable(Table table){this.table = table;}
    public Table getTable(){return table;}
    public void removeTable(){this.table = null;}

    private final String owningSide;
    public String getOwningSide() {return owningSide;}
    public boolean hasOwningSide(){return owningSide != null && !owningSide.isEmpty() && !owningSide.isBlank();}

}
