package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;

/**
 * This class holds a collection of methods to traverse a given Er-graph more easily
 * The implementation of specific ER-Elements can be found in
 * @see ErEntityUtil
 * @see ErIsAUtil
 * @see ErRelationUtil
 */
public class ErUtil {

    /**
     * Shortcut to receive the erType for a node element
     */
    public static ErType resolveErType(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){
        return resolveErData(erElement).getErType();
    }

    /**
     * Shortcut to receive the erType for a tree element
     */
    public static ErType resolveErType(TreeNode<EntityRelationElement> erElement){
        return erElement.getTreeData().getErType();
    }

    /**
     * Shortcut to receive the meta information for a tree element
     */
    public static ElementMetaInformation resolveMetaInformation(TreeNode<EntityRelationElement> erElement){
        return erElement.getTreeData().getElementMetaInformation();
    }

    /**
     * Shortcut to receive the element data for a node element
     */
    public static EntityRelationElement resolveErData(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){
        return erElement.getNodeData().getTreeData();
    }


    /**
     * Shortcut to receive the element data for a tree element
     */
    public static EntityRelationElement resolveErData(TreeNode<EntityRelationElement> erElement){
        return erElement.getTreeData();
    }

    /**
     * Returns all relations the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph nodes, representing the relations
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelationsOfEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return ErEntityUtil.resolveRelationsOfEntity(entity);
    }

    /**
     * Returns all entities connected to the relation
     * <pre>
     *     Entity0 <-> Relation <-> Entity1
     *                          <-> Entity2
     *     Return: Entity0, Entity1, Entity2
     * </pre>
     * @param relation The relation which will be queried for
     * @return A list of GraphNodes representing the entities
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return ErEntityUtil.resolveEntitiesConnectedToRelation(relation);
    }

    /**
     * Returns all entities connected to the relation, without the element specified in the first argument
     * <pre>
     *     Origin Entity <-> Relation <-> Entity1
     *                                <-> Entity2
     *     Return: Entity1, Entity2
     * </pre>
     * @param originEntity The entity, which should be excluded from the result list
     * @param relation The relation which will be queried for
     * @return A list of GraphNodes representing the entities
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveOtherEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> originEntity,
                                            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return ErEntityUtil.resolveOtherEntitiesConnectedToRelation(originEntity, relation);
    }

    /**
     * Returns all elements the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph nodes, representing the other elements
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveElementsConnectionToEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return ErEntityUtil.resolveElementsConnectionToEntity(entity);
    }

    /**
     * Resolves all inheritors of the given IsA Structure
     * @param isAStructure The IsA Structure to query for
     * @return All inheritors of the isA Structure
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveInheritorsOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return ErIsAUtil.resolveInheritorsOfIsAStructure(isAStructure);
    }

    /**
     * Resolves the base entity of the given IsA Structure
     * @param isAStructure The IsA Structure to query for
     * @return The parent of the isA Structure
     */
    public static GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
    resolveParentOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return ErIsAUtil.resolveParentOfIsAStructure(isAStructure);
    }


    /**
     * Resolves all nodes which represent strong relations
     * @param erGraph The graph to query for
     * @return A list of nodes representing strong relations
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveStrongRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return ErRelationUtil.resolveStrongRelations(erGraph);
    }

    /**
     * Resolves all nodes which represent strong relations and have a degree of 2,
     * e.g. are connected to exactly 2 other entities
     * @param erGraph The graph to query for
     * @return A list of nodes representing strong relations with degree of 2
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveStrongRelationsOfDeg2(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return ErRelationUtil.resolveStrongRelationsOfDeg2(erGraph);
    }
}
