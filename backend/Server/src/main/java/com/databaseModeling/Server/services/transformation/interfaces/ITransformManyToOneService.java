package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformManyToOneService {

    /**
     * Transforms every 1:N relation found in the graph (not tree) by merging the table of the relation
     * into the table of the many side and creating foreign keys to the table of the one side
     * @param erGraph The graph to modify
     */
    void transformManyToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);

}
