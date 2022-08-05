package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITableCreatorService {

    /**
     * Creates tables for each graph and tree node in the given graph
     * @param erGraph The graph to create tables for
     */
    void createTables(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);
}
