package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformManyToManyService {


    /**
     * Transforms every N:M relation found in the graph (not tree) by creating foreign keys on the relation table,
     * referencing the table of each node connected to the graph
     * @param erGraph The graph to modify
     */
    void transformManyToManyRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);

}
