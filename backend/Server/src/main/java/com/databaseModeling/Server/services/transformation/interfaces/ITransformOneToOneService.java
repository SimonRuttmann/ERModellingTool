package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformOneToOneService {

    /**
     * Transforms all kinds of 1:1 relations by merging the relation table into the owning side entity
     * and creating foreign keys. The owning side is determined via the optionality or the property owning side
     * for mandatory:mandatory and optional:optional relations
     *
     * @param erGraph The erGraph to modify
     */
    void transformOneToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);
}
