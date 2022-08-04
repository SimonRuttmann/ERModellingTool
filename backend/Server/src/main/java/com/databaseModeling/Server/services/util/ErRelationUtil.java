package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;
import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.resolveErType;

public class ErRelationUtil {

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.StrongRelation ||
                        resolveErType(node) == ErType.WeakRelation).
                collect(Collectors.toList());

    }

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveStrongRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        return resolveRelations(erGraph).stream().
                filter(node -> resolveErType(node) == ErType.StrongRelation).
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
