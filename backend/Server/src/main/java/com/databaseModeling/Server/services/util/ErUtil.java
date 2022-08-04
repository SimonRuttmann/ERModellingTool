package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.ElementMetaInformation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;

public class ErUtil { //Extends ISAUtil, RelationUtil, EntityUtil

    public static String resolveAssociationQualifiedName(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> edge){

        var sourceDesc = resolveErTypeQualifiedName(edge.getSource());
        var destDesc = resolveErTypeQualifiedName(edge.getDestination());

        return "Association from " + sourceDesc + " to " + destDesc;
    }

    public static String resolveErTypeQualifiedName(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){

        var erData = resolveErData(erElement);
        return erData.getErType().displayName + " with name " +erData.getElementMetaInformation().getDisplayName();
    }

    public static ErType resolveErType(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){
        return resolveErData(erElement).getErType();
    }

    public static ErType resolveErType(TreeNode<EntityRelationElement> erElement){
        return erElement.getTreeData().getErType();
    }

    public static ElementMetaInformation resolveMetaInformation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){
        return resolveErData(erElement).getElementMetaInformation();
    }

    public static ElementMetaInformation resolveMetaInformation(TreeNode<EntityRelationElement> erElement){
        return erElement.getTreeData().getElementMetaInformation();
    }

    public static EntityRelationElement resolveErData(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){

        return erElement.getNodeData().getTreeData();
    }


    public static EntityRelationElement resolveErData(TreeNode<EntityRelationElement> erElement){
        return erElement.getTreeData();
    }


    public static GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
    resolveEntityById(String id, Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        return ErEntityUtil.resolveEntityById(id, erGraph);
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

    //TODO VALIDATION IF ISA HAS NO BASE

    /**
     * Resolves the base entity of the given IsA Structure
     * @param isAStructure The IsA Structure to query for
     * @return The parent of the isA Structure
     */
    public static GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
    resolveParentOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return ErIsAUtil.resolveParentOfIsAStructure(isAStructure);
    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return ErRelationUtil.resolveRelations(erGraph);
    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveStrongRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return ErRelationUtil.resolveStrongRelations(erGraph);
    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelationsOfDeg2(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return ErRelationUtil.resolveRelationsOfDeg2(erGraph);
    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveStrongRelationsOfDeg2(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return ErRelationUtil.resolveStrongRelationsOfDeg2(erGraph);
    }
}
