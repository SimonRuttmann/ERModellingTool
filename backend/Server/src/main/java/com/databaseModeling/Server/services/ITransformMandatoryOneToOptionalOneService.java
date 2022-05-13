package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformMandatoryOneToOptionalOneService {

    void transformMandatoryOneToOptionalOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);
}
