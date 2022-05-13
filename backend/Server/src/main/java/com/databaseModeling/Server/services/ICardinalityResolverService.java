package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.EntityRelationAssociation;
import com.databaseModeling.Server.model.EntityRelationElement;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.tree.TreeNode;

public interface ICardinalityResolverService {

    /**
     * Resolves the cardinality of every association with AssociationType.Association
     * @param erGraph
     * @param validationResult
     */
    void ResolveCardinalities(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph, ValidationResult validationResult);
}
