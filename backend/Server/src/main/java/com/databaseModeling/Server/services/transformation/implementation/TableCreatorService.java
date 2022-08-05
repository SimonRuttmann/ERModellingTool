package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITableCreatorService;

import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TableCreatorService implements ITableCreatorService {


    public TableCreatorService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;


    @Override
    public void createTables(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        //Recursively add tables for each graph node and tree node
        for(var node : erGraph.graphNodes){
            createNodeAndAttributeTables(node.getNodeData());
        }
    }

    private void createNodeAndAttributeTables(TreeNode<EntityRelationElement> parent){

        //On the first execution the node table will be created, further iterations add the attribute tables
        var table = tableManager.createTable(resolveErType(parent), resolveMetaInformation(parent));
        resolveErData(parent).addInitialTable(table);

        //Traversal of tree
        for (var child : parent.getChildren()) {
            createNodeAndAttributeTables(child);
        }
    }
}
