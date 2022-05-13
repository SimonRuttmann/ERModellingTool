package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.ValidationResult;

public interface ICardinalityResolverService {

    /**
     * Resolves the cardinality of every association with AssociationType.Association
     * @param erGraph
     * @param validationResult
     */
    void ResolveCardinalities(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph, ValidationResult validationResult);
}
