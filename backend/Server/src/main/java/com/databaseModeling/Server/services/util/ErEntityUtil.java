package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;
import java.util.stream.Collectors;

public class ErEntityUtil {

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
    resolveRelationsOfEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

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
    resolveEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

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
    resolveOtherEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> originEntity,
                                            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return  resolveEntitiesConnectedToRelation(relation).
                stream().
                filter(node -> !node.equals(originEntity)).
                collect(Collectors.toList());

    }

    /**
     * Returns all elements the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph nodes, representing the other elements
     */
    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveElementsConnectionToEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return  entity.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(entity)).
                collect(Collectors.toList());
    }

}
