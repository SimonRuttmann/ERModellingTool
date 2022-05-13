package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.Cardinality;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformOptionalOneToOptionalOneService;

import static com.databaseModeling.Server.model.NodeTableManager.AddForeignKeysAsNormalColumn;
import static com.databaseModeling.Server.model.NodeTableManager.MergeTables;
import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;
import static com.databaseModeling.Server.services.util.ErUtil.resolveRelationsOfDeg2;

public class TransformOptionalOneToOptionalOneService implements ITransformOptionalOneToOptionalOneService {

    @Override
    public void transformOptionalOneToOptionalOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveRelationsOfDeg2(erGraph);
        relations.forEach(this::transformOptionalOneToOptionalOneRelation);

    }

//For one-to-one bidirectional relationships, the owning side corresponds to the side that contains the corresponding foreign key.
    private void transformOptionalOneToOptionalOneRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {

        var firstEdge = relation.getEdges().get(0);
        var secondEdge = relation.getEdges().get(1);

        var nodeOfFirstEge = firstEdge.getOtherSide(relation);
        var nodeOfSecondEdge = secondEdge.getOtherSide(relation);

        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> owningNode = null;
        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> nodeToReference = null;

        if (!isOptionalToOptional(firstEdge, secondEdge)) return;

        if(resolveErData(relation).getOwningSide().equals(nodeOfFirstEge.getId())){
            owningNode = nodeOfFirstEge;
            nodeToReference = nodeOfSecondEdge;
        }else{
            owningNode = nodeOfSecondEdge;
            nodeToReference = nodeOfFirstEge;
        }


        MergeTables(owningNode, relation);
        AddForeignKeysAsNormalColumn(nodeToReference, owningNode);

        resolveErData(relation).setTransformed(true);
    }

    private boolean isOptionalToOptional(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                         GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality == Cardinality.OptionalOne &&
               secondCardinality == Cardinality.OptionalOne;
    }

}
