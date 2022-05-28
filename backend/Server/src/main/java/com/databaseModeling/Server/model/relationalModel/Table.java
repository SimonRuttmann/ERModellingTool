package com.databaseModeling.Server.model.relationalModel;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public final class Table {

    private final String id;

    public String getId() {return id;}

    public String originDisplayName;
    public void setOriginDisplayName(String originDisplayName){
        this.originDisplayName = originDisplayName;
    }


    //used for attribute tables
    private final List<Table> referencedAttributeTables = new ArrayList<Table>();

    public List<Table> getReferencesToChildAttributeTables(){
        return referencedAttributeTables;
    }

    public void addReferenceToChildAttributeTable(Table childAttributeTable){
        referencedAttributeTables.add(childAttributeTable);
    }

    public void addAllReferencesToChildAttributeTable(List<Table> childAttributeTables){
        referencedAttributeTables.addAll(childAttributeTables);
    }

    public void removeReferenceToChildAttributeTable(Table childAttributeTable){
        referencedAttributeTables.remove(childAttributeTable);
    }

    public void clearReferencedAttributeTable(){
        referencedAttributeTables.clear();
    }

    public Boolean isFixedAttributeTable = false;


    //used for weak entity tables
    public Table referencedIdentifyingTable = null;
    public Boolean isWeakEntityTable = false;
    public Boolean isTransformed = false;

    public int round = -1;
    public boolean isStrongWithReferences(){
        if (isWeakEntityTable) return referencedIdentifyingTable != null;
        return true;
    }
    public Table(String id) {
        this.id = id;
    }

    private final List<Column> columns = new ArrayList<>();

    public void addColumn(Column column){
        columns.add(column);
    }

    public void removeColumn(Column column){
        columns.remove(column);
    }

    public List<Column> getPrimaryKeys(){
        return columns.stream().filter(Column::isPrimaryKey).collect(Collectors.toList());
    }

    public List<Column> getForeignKeys(){
        return columns.stream().filter(Column::isForeignKey).collect(Collectors.toList());
    }

    public List<Column> getColumns(){
        return columns;
    }


    public void clearColumns() {
        columns.clear();
    }

}
