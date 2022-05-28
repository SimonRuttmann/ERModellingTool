package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.conceptionalModel.AssociationType;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;
import java.util.stream.Collectors;

public class ErUtil  { //Extends ISAUtil, RelationUtil, EntityUtil

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

    public static EntityRelationElement resolveErData(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){

        return erElement.getNodeData().getTreeData();
    }


    //ENTITY UTIL

    public static GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
    resolveEntityById(String id, Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph){

        return erGraph.graphNodes.stream().filter(node -> node.getId().equals(id)).findFirst().orElseThrow();
    }

    /**
     * Returns all relations the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph nodes, representing the relations
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    ResolveRelationsOfEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return  entity.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(entity)).
                collect(Collectors.toList());
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
    ResolveEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return  relation.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(relation)).
                collect(Collectors.toList());
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
    ResolveOtherEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> originEntity,
                                            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return  ResolveEntitiesConnectedToRelation(relation).
                stream().
                filter(node -> !node.equals(originEntity)).
                collect(Collectors.toList());

    }

    //ISA UTIL
    /**
     * Returns all elements the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph nodes, representing the other elements
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    ResolveElementsConnectionToEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return  entity.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(entity)).
                collect(Collectors.toList());
    }
    private static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    ResolveTypesConnectedToIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure, AssociationType type){

        return  isAStructure.
                getEdges().
                stream().
                filter(edge -> edge.getEdgeData().getAssociationType() == type).
                map(edge -> edge.getOtherSide(isAStructure)).
                collect(Collectors.toList());
    }

    /**
     * Resolves all inheritors of the given IsA Structure
     * @param isAStructure The IsA Structure to query for
     * @return All inheritors of the isA Structure
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    ResolveInheritorsOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return  ResolveTypesConnectedToIsAStructure(isAStructure, AssociationType.Inheritor);
    }

    //TODO VALIDATION IF ISA HAS NO BASE

    /**
     * Resolves the base entity of the given IsA Structure
     * @param isAStructure The IsA Structure to query for
     * @return The parent of the isA Structure
     */
    public static GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
    ResolveParentOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return  ResolveTypesConnectedToIsAStructure(isAStructure, AssociationType.Parent).stream().findFirst().orElseThrow();
    }


    //RELATION UTIL

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.StrongRelation ||
                        resolveErType(node) == ErType.WeakRelation).
                filter(node -> node.getDegree() == 2).
                collect(Collectors.toList());


    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelationsOfDeg2(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return resolveRelations(erGraph).stream().
                filter(node -> node.getDegree() == 2).
                collect(Collectors.toList());

    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveStrongRelationsOfDeg2(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return resolveRelationsOfDeg2(erGraph).stream().
                filter(node -> resolveErType(node) == ErType.StrongRelation).
                collect(Collectors.toList());
    }
}
