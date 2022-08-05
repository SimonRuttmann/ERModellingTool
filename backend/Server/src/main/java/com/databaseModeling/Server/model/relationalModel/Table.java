package com.databaseModeling.Server.model.relationalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * This class represents a table in the relational model
 * For transformation it has additional properties indicating their processing state
 *
 * All tables are created, modified and accessed via the TableManager
 * @see TableManager
 */
public final class Table {

    private String id;
    public String getId() {return id;}
    public void setId(String id){this.id = id;}

    private String originDisplayName;
    public String getOriginDisplayName() {return originDisplayName;}
    public void setOriginDisplayName(String originDisplayName){this.originDisplayName = originDisplayName;}

    private final List<Column> columns = new ArrayList<>();
    public void addColumn(Column column){columns.add(column);}
    public List<Column> getColumns(){return columns;}
    public void clearColumns() {columns.clear();}

    public List<Column> getPrimaryKeys(){
        return columns.stream().filter(Column::isPrimaryKey).collect(Collectors.toList());
    }

    private final ElementMetaInformation elementMetaInformation;
    public ElementMetaInformation getMetaInformation(){return elementMetaInformation;}

    public Table(ElementMetaInformation elementMetaInformation) {
        this.elementMetaInformation = elementMetaInformation;
    }

    //------------ Attribute Table -------------//

    //Reference holder to attribute tables
    private final List<Table> referencedAttributeTables = new ArrayList<>();
    public List<Table> getReferencesToChildAttributeTables(){return referencedAttributeTables;}
    public void addReferenceToChildAttributeTable(Table childAttributeTable){referencedAttributeTables.add(childAttributeTable);}
    public void addAllReferencesToChildAttributeTable(List<Table> childAttributeTables){referencedAttributeTables.addAll(childAttributeTables);}

    //Additional data for attribute tables
    private boolean fixedAttributeTable = false;
    public boolean isFixedAttributeTable() {return fixedAttributeTable;}
    public void setFixedAttributeTable(boolean fixedAttributeTable) {this.fixedAttributeTable = fixedAttributeTable;}

    //------------ Weak Type Table -------------//

    //Reference holder for weak type tables
    private Table referencedIdentifyingTable = null;
    public Table getReferencedIdentifyingTable() {return referencedIdentifyingTable;}
    public void setReferencedIdentifyingTable(Table referencedIdentifyingTable) {this.referencedIdentifyingTable = referencedIdentifyingTable;}

    //Determines if this table is a weak entity table
    private Boolean weakEntityTable = false;
    public Boolean isWeakEntityTable() {return weakEntityTable;}
    public void setWeakEntityTable(Boolean weakEntityTable) {this.weakEntityTable = weakEntityTable;}

    //Boolean to indicate if this table was already transformed while weak type processing
    public Boolean transformed = false;
    public Boolean isTransformed() {return transformed;}
    public void setTransformed(Boolean transformed) {this.transformed = transformed;}

    public boolean isStrongWithReferences(){
        if (weakEntityTable) return referencedIdentifyingTable != null;
        return true;
    }

}
