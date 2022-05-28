package com.databaseModeling.Server.model.relationalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public final class Table {

    private final String id;

    public String getId() {return id;}

    private String originDisplayName;

    public String getOriginDisplayName() {
        return originDisplayName;
    }

    public void setOriginDisplayName(String originDisplayName){
        this.originDisplayName = originDisplayName;
    }

    //used for attribute tables
    private final List<Table> referencedAttributeTables = new ArrayList<>();
    public List<Table> getReferencesToChildAttributeTables(){return referencedAttributeTables;}
    public void addReferenceToChildAttributeTable(Table childAttributeTable){referencedAttributeTables.add(childAttributeTable);}
    public void addAllReferencesToChildAttributeTable(List<Table> childAttributeTables){referencedAttributeTables.addAll(childAttributeTables);}

    private boolean fixedAttributeTable = false;
    public boolean isFixedAttributeTable() {return fixedAttributeTable;}
    public void setFixedAttributeTable(boolean fixedAttributeTable) {this.fixedAttributeTable = fixedAttributeTable;}
    //end used for attribute tables

    //used for weak entity tables
    private Table referencedIdentifyingTable = null;
    public Table getReferencedIdentifyingTable() {return referencedIdentifyingTable;}
    public void setReferencedIdentifyingTable(Table referencedIdentifyingTable) {this.referencedIdentifyingTable = referencedIdentifyingTable;}

    private Boolean weakEntityTable = false;
    public Boolean isWeakEntityTable() {return weakEntityTable;}
    public void setWeakEntityTable(Boolean weakEntityTable) {this.weakEntityTable = weakEntityTable;}

    public Boolean transformed = false;
    public Boolean isTransformed() {return transformed;}
    public void setTransformed(Boolean transformed) {this.transformed = transformed;}

    public boolean isStrongWithReferences(){
        if (weakEntityTable) return referencedIdentifyingTable != null;
        return true;
    }

    //end used for weak entity tables
    public Table(String id, ElementMetaInformation elementMetaInformation) {
        this.id = id;
        this.elementMetaInformation = elementMetaInformation;
    }
    private final List<Column> columns = new ArrayList<>();
    public void addColumn(Column column){columns.add(column);}
    public List<Column> getPrimaryKeys(){
        return columns.stream().filter(Column::isPrimaryKey).collect(Collectors.toList());
    }

    public List<Column> getColumns(){
        return columns;
    }

    public void clearColumns() {
        columns.clear();
    }

    private final ElementMetaInformation elementMetaInformation;
    public ElementMetaInformation getMetaInformation(){
        return elementMetaInformation;
    }

}
