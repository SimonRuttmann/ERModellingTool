package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;
import java.util.stream.Collectors;

public class ErEntityUtil {

    protected static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelationsOfEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return  entity.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(entity)).
                collect(Collectors.toList());
    }

    protected static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return  relation.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(relation)).
                collect(Collectors.toList());
    }

    protected static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveOtherEntitiesConnectedToRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> originEntity,
                                            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        return  resolveEntitiesConnectedToRelation(relation).
                stream().
                filter(node -> !node.equals(originEntity)).
                collect(Collectors.toList());

    }

    protected static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveElementsConnectionToEntity(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> entity){

        return  entity.
                getEdges().
                stream().
                map(edge -> edge.getOtherSide(entity)).
                collect(Collectors.toList());
    }

}
