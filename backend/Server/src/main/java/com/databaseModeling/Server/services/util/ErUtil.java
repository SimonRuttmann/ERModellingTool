package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.text.MessageFormat;
import java.util.List;
import java.util.stream.Collectors;

public class ErUtil {

    public static String resolveAssociationQualifiedName(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> edge){

        var sourceDesc = resolveErTypeQualifiedName(edge.getSource());
        var destDesc = resolveErTypeQualifiedName(edge.getDestination());

        return MessageFormat.format("Association from {1} to {2}", sourceDesc, destDesc );

    }

    public static String resolveErTypeQualifiedName(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){

        var erData = resolveErData(erElement);
        return MessageFormat.format("{1} with name {2}", erData.getErType().displayName, erData.getElementMetaInformation().getDisplayName() );
    }
    public static ErType resolveErType(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){

        return resolveErData(erElement).getErType();
    }

    public static EntityRelationElement resolveErData(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> erElement){

        return erElement.getNodeData().getTreeData();
    }


    /**
     * Returns all relations the given entity is connected to
     * @param entity The entity to query for
     * @return A list of graph edges, representing the relations
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
}
