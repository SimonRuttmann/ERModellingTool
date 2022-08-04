package com.databaseModeling.Server.services.transformation.interfaces;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

public interface ITransformWeakTypesService {


    /**
     * Transforms all weak entities into the relational model
     * Each table of a weak entity will have a table with a reference to an identifying table
     *
     * @param erGraph The graph to modify
     *
     * This method only deletes, merges and adds object references between the tables
     * To update the foreign keys of the tables, it is necessary to call the following method
     * @see ITransformWeakTypesService#generateIdentifyingPrimaryKeys(Graph)
     */
    void transformWeakTypes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);

    /**
     * Resolves all object references and applies the foreign and primary keys accordingly
     * @param erGraph The graph to modify
     *
     * Requires that the object references are set
     * @see ITransformWeakTypesService#transformWeakTypes(Graph)
     */
    void generateIdentifyingPrimaryKeys(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);

}
