package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ICardinalityResolverService {

    /**
     * Resolves the cardinality of every association with AssociationType.Association
     * @param erGraph The graph to transform
     * @see com.databaseModeling.Server.model.conceptionalModel.AssociationType#Association
     */
    void ResolveCardinalities(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);
}
