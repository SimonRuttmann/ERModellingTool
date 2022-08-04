package com.databaseModeling.Server.services.util;

import com.databaseModeling.Server.model.conceptionalModel.AssociationType;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.List;
import java.util.stream.Collectors;

public class ErIsAUtil {

    public static List<GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>>
    resolveTypesConnectedToIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure, AssociationType type){

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
    resolveInheritorsOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return  resolveTypesConnectedToIsAStructure(isAStructure, AssociationType.Inheritor);
    }

    /**
     * Resolves the base entity of the given IsA Structure
     * @param isAStructure The IsA Structure to query for
     * @return The parent of the isA Structure
     */
    public static GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation>
    resolveParentOfIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure){

        return  resolveTypesConnectedToIsAStructure(isAStructure, AssociationType.Parent).stream().findFirst().orElseThrow();
    }

}
