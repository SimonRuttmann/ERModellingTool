package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.NodeTableManager;
import com.databaseModeling.Server.model.conceptionalModel.Cardinality;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformMandatoryOneToMandatoryOneService;

import static com.databaseModeling.Server.model.NodeTableManager.MergeTables;
import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;
import static com.databaseModeling.Server.services.util.ErUtil.resolveRelationsOfDeg2;

public class TransformMandatoryOneToMandatoryOneService implements ITransformMandatoryOneToMandatoryOneService {

    @Override
    public void transformMandatoryOneToMandatoryOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveRelationsOfDeg2(erGraph);
        relations.forEach(this::transformMandatoryOneToMandatoryOneRelation);

    }

    //A <- 1,1 -> AB <- 1,1 -> B
    // A-AB -> B
    // B-AB -> A
    private void transformMandatoryOneToMandatoryOneRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {

        var firstEdge = relation.getEdges().get(0);
        var secondEdge = relation.getEdges().get(1);

        var nodeOfFirstEge = firstEdge.getOtherSide(relation);
        var nodeOfSecondEdge = secondEdge.getOtherSide(relation);

        if (!isMandatoryToMandatory(firstEdge, secondEdge)) return;

        if(resolveErData(relation).isShouldBeMerged())  mergeMandatoryOneToMandatoryOne(relation, nodeOfFirstEge, nodeOfSecondEdge);

        else {
            if(resolveErData(relation).getOwningSide().equals(nodeOfFirstEge.getId()))
                 createReferenceTo(relation, nodeOfSecondEdge, nodeOfFirstEge); //First is owning  >> First|Relation -> Second
            else createReferenceTo(relation, nodeOfFirstEge, nodeOfSecondEdge); //Second is owning >> Second|Relation -> First
        }

        resolveErData(relation).setTransformed(true);
    }

    private boolean isMandatoryToMandatory(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                           GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality == Cardinality.MandatoryOne &&
                secondCardinality == Cardinality.MandatoryOne;
    }

    private void createReferenceTo(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencedNode,
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> referencingNode,
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        MergeTables(referencingNode, relation);
        NodeTableManager.AddForeignKeysAsPrimaryKeys(referencedNode,referencingNode);

    }


    private void mergeMandatoryOneToMandatoryOne(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> owningNode,
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> nodeToMerge,
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        //A >-> B <-> C
        // CB
        // ACB
        MergeTables(nodeToMerge, relation);
        MergeTables(owningNode, nodeToMerge);

    }

}

