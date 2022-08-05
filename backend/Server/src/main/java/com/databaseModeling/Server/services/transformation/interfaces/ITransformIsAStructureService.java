package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformIsAStructureService {

    /**
     * Transforms isA Structures by adding a reference from the subtypes to the supertypes of the isA
     * Also cascades the primary keys
     * Requires all primary keys set in the tables connected to the given graph
     * @param erGraph The graph to modify
     */
    void transformIsAStructures(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);

}
