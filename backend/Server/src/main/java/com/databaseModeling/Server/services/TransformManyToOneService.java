package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.ResolveEntitiesConnectedToRelation;
import static com.databaseModeling.Server.services.util.ErUtil.resolveErType;

public class TransformManyToOneService implements ITransformManyToOneService{


    @Override
    public void transformManyToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {


        var relations = erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.StrongRelation ||
                               resolveErType(node) == ErType.IdentifyingRelation).
                filter(relation -> relation.getDegree() == 2).
                collect(Collectors.toList());



        for (var relation : relations){

            for (var edge : relation.getEdges()){
                String first = edge.getEdgeData().getMin();
            }
            var entities = ResolveEntitiesConnectedToRelation(relation);

        }

    }
}
