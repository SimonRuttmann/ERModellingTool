package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.Cardinality;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformMandatoryOneToOptionalOneService;

import static com.databaseModeling.Server.model.NodeTableManager.AddForeignKeysAsNormalColumn;
import static com.databaseModeling.Server.model.NodeTableManager.MergeTables;
import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;
import static com.databaseModeling.Server.services.util.ErUtil.resolveRelationsOfDeg2;

public class TransformMandatoryOneToOptionalOneService implements ITransformMandatoryOneToOptionalOneService {
    @Override
    public void transformMandatoryOneToOptionalOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveRelationsOfDeg2(erGraph);
        relations.forEach(this::transformMandatoryOneToOptionalOneRelation);

    }
    // A - 0,1 - AB - 1,1 C
    //We add the foreign key to the mandatory c side, as we do not need a nullable foreign key

    //A - 1,1 (mand)- AB - 0,1(opt) - C stimmt hier
    private void transformMandatoryOneToOptionalOneRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {

        var firstEdge = relation.getEdges().get(0);
        var secondEdge = relation.getEdges().get(1);

        var nodeOfFirstEge = firstEdge.getOtherSide(relation);
        var nodeOfSecondEdge = secondEdge.getOtherSide(relation);

        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> mandatoryNode;
        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> optionalNode;

        if (isMandatoryToOptional(firstEdge, secondEdge)) {
            mandatoryNode = nodeOfSecondEdge;
            optionalNode = nodeOfFirstEge;
        }
        else if(isMandatoryToOptional(firstEdge, secondEdge)){
            mandatoryNode = nodeOfFirstEge;
            optionalNode = nodeOfSecondEdge;
        }
        else return;


        MergeTables(optionalNode, relation);
        AddForeignKeysAsNormalColumn(mandatoryNode, optionalNode);

        resolveErData(relation).setTransformed(true);
    }

    private boolean isMandatoryToOptional(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                          GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality == Cardinality.MandatoryOne &&
               secondCardinality == Cardinality.OptionalOne;
    }

}
