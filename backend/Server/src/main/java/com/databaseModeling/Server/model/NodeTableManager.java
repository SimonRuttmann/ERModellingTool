package com.databaseModeling.Server.model;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;

import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;

/**
 * Higher abstraction of TableManager
 */
public class NodeTableManager {

    public static void AddForeignKeysAsNormalColumn( GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencedNode,
                                              GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencingNode){

        var referencedTable = resolveErData(referencedNode).getTable();
        var referencingTable = resolveErData(referencingNode).getTable();
        TableManager.AddForeignKeysToTableAsNormalColumn(referencedTable, referencingTable);

    }


    public static void AddForeignKeysAsPrimaryKeys ( GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencedNode,
                                                     GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencingNode){

        var referencedTable = resolveErData(referencedNode).getTable();
        var referencingTable = resolveErData(referencingNode).getTable();
        TableManager.AddForeignKeysToTableAsPrimaryKeys(referencedTable, referencingTable);

    }


    public static void MergeTables(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> owningNode,
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> nodeToMerge){

        var tableToMerge = resolveErData(nodeToMerge).getTable();
        var referencingTables = nodeToMerge.
                getNodeData().
                getChildren().
                stream().
                map(child -> child.getTreeData().getTable()).
                collect(Collectors.toList());


        var owningTable = resolveErData(owningNode).getTable();

        referencingTables.forEach(table -> {
            if(table.referencedAttributeTable == tableToMerge){
                table.referencedAttributeTable = owningTable;
            }

            //TODO needed?
            if(table.referencedIdentifyingTable == tableToMerge){
                table.referencedIdentifyingTable = owningTable;
            }
        });

        TableManager.AddColumns(owningTable, tableToMerge.getColumns());

    }
}
