package com.databaseModeling.Server.model.relationalModel;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;

import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;

/**
 * This class is responsible for querying, creation, deletion and modification of tables
 */
public class TableManager {

    public TableManager(){
        tableRegister = new TableRegister();
    }

    /**
     * Register which holds all tables created by this table manager instance
     */
    private final TableRegister tableRegister;

    /**
     * Creates a new table instance based on the entity relationship element
     * and adds the table to an intern register
     * @param erType The entity relationship element to create a table for
     * @param elementMetaInformation Additional meta information which will be added to the table
     */
    public Table createTable(ErType erType, ElementMetaInformation elementMetaInformation){
        return TableFactory.createTable(erType, elementMetaInformation, tableRegister);
    }

    /**
     * @return All registered tables
     */
    public List<Table> getTables(){
        return tableRegister.receiveRegisteredTables();
    }

    /**
     * Removes the table from the intern register
     * @param entityRelationElement The entity relationship element to remove the table from
     */
    public void removeTable(EntityRelationElement entityRelationElement){
        tableRegister.unregisterTable(entityRelationElement.getTable());
        entityRelationElement.removeTable();
    }

    /**
     * Adds a collection of columns to the table
     * @param table The table to add columns to
     * @param columns The columns to add
     */
    public void addColumns(Table table, List<Column> columns) {
        columns.forEach(table::addColumn);
    }

    /**
     * Creates foreign keys, referencing the primary keys of the table
     * The foreign keys will be primary keys
     * @see TableManager#addForeignKeysToTable(Table, Table, boolean)
     */
    public void addForeignKeysToTableAsPrimaryKeys(Table referencedTable, Table referencingTable){
        addForeignKeysToTable(referencedTable, referencingTable, true);
    }

    /**
     * Creates foreign keys, referencing the primary keys of the table
     * The foreign keys will be normal columns, no primary key columns
     * @see TableManager#addForeignKeysToTable(Table, Table, boolean)
     */
    public void addForeignKeysToTableAsNormalColumn(Table referencedTable, Table referencingTable){
        addForeignKeysToTable(referencedTable, referencingTable, false);
    }

    /**
     * Creates for each primary key of the referenced table a foreign key in the referencing table
     * The reference itself is managed by using the referenced primary keys id
     * @param referencedTable The table which need to be referenced to
     * @param referencingTable The table which references the given table
     * @param withPrimaryKey If true, all created foreign keys will be primary keys in the referencing table
     */
    private void addForeignKeysToTable(Table referencedTable, Table referencingTable, boolean withPrimaryKey){

        for (var primaryKey : referencedTable.getPrimaryKeys()) {

            Column column = new Column();
            column.setId(TableFactory.generateColumnId(referencingTable.getId(), referencingTable.getColumns().size()));
            column.setColumnName(primaryKey.getColumnName());

            column.getKey().setIsForeignKey(true);
            column.getKey().setReferencesId(primaryKey.getId());
            column.getKey().setIsPrimaryKey(withPrimaryKey);

            referencingTable.addColumn(column);
        }
    }

    /**
     * Convenient method to add the foreign keys of the graph nodes tables directly as normal, not primary key, columns
     * @see TableManager#addForeignKeysToTableAsNormalColumn(Table, Table)
     */
    public void addForeignKeysAsNormalColumn(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencedNode,
                                             GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencingNode){

        var referencedTable = resolveErData(referencedNode).getTable();
        var referencingTable = resolveErData(referencingNode).getTable();
        addForeignKeysToTableAsNormalColumn(referencedTable, referencingTable);

    }

    /**
     * Convenient method to add the foreign keys of the graph nodes tables directly as primary key columns
     * @see TableManager#addForeignKeysToTableAsPrimaryKeys(Table, Table)
     */
    public void addForeignKeysAsPrimaryKeys(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencedNode,
                                            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencingNode){

        var referencedTable = resolveErData(referencedNode).getTable();
        var referencingTable = resolveErData(referencingNode).getTable();
        addForeignKeysToTableAsPrimaryKeys(referencedTable, referencingTable);

    }

    /**
     * Merges to tables of given graph nodes by adding all columns of the table to merge into the owning table
     * The referenced tables of the table to merge will be added to the references of the owning table
     * @param owningNode The node, which table will receive all columns and references of the table to merge
     * @param nodeToMerge The node, which table will be merged into the owning nodes table
     */
    public void mergeTables(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> owningNode,
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> nodeToMerge){

        var tableToMerge = resolveErData(nodeToMerge).getTable();
        var referencingTables = tableToMerge.getReferencesToChildAttributeTables();

        var owningTable = resolveErData(owningNode).getTable();
        owningTable.addAllReferencesToChildAttributeTable(referencingTables);

        addColumns(owningTable, tableToMerge.getColumns());
        removeTable(nodeToMerge.getNodeData().getTreeData());
    }


}
