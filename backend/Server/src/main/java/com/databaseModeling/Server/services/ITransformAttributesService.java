package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.EntityRelationAssociation;
import com.databaseModeling.Server.model.EntityRelationElement;
import com.databaseModeling.Server.model.graph.Graph;
import com.databaseModeling.Server.model.tree.TreeNode;

public interface ITransformAttributesService {

    /**
     * Transforms all attributes to the relational model
     * Therefore each graph node will have a table containing the attributes
     * In addition, there will be more tables created, if multivalued attributes are involved
     *
     * The parent table will have all primary keys from the attributes applied
     *
     * @param erGraph The graph to modify
     *
     * This method only deletes, merges and adds tables connected with object references between the tables
     * To update the foreign keys of the tables, it is necessary to call the following method
     * @see ITransformAttributesService#generateAttributeTableKeys(Graph)
     */
    void transformAttributes(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);


    /**
     * Resolves all object references and applies the foreign keys accordingly
     * @param erGraph The graph to modify
     *
     * Requires that the object references are set
     * @see ITransformAttributesService#transformAttributes(Graph)
     */
    void generateAttributeTableKeys(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph);
}
