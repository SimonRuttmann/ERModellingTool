package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.Cardinality;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformOneToOneService;

import static com.databaseModeling.Server.model.NodeTableManager.AddForeignKeysAsNormalColumn;
import static com.databaseModeling.Server.model.NodeTableManager.MergeTables;
import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TransformOneToOneService implements ITransformOneToOneService {

    @Override
    public void transformOneToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveStrongRelationsOfDeg2(erGraph);
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

        if(!isOneToOneAnyKind(firstEdge, secondEdge)) return;

        //Owning side is specified
        if (isOptionalToOptional(firstEdge, secondEdge) || isMandatoryToMandatory(firstEdge, secondEdge)) {

            if (resolveErData(relation).hasOwningSide() && resolveErData(relation).getOwningSide().equals(nodeOfFirstEge.getId())) {
                owningNode = nodeOfFirstEge;
                nodeToReference = nodeOfSecondEdge;
            } else {
                owningNode = nodeOfSecondEdge;
                nodeToReference = nodeOfFirstEge;
            }
        }

        //Owning side is the mandatory side
        if(isMandatoryToOptional(firstEdge, secondEdge)){
            owningNode = nodeOfSecondEdge;
            nodeToReference = nodeOfFirstEge;
        }

        if(isMandatoryToOptional(secondEdge, firstEdge)){
            owningNode = nodeOfFirstEge;
            nodeToReference = nodeOfSecondEdge;
        }

        //Merge relation into owning node
        MergeTables(owningNode, relation);
        //Add foreign keys to the owning node
        AddForeignKeysAsNormalColumn(nodeToReference, owningNode);

        var relationData = resolveErData(relation);
        relationData.setTransformed(true);
        relationData.removeTable();
    }

    private boolean isOptionalToOptional(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                         GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality == Cardinality.OptionalOne &&
                secondCardinality == Cardinality.OptionalOne;
    }

    private boolean isMandatoryToMandatory(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                           GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality == Cardinality.MandatoryOne &&
                secondCardinality == Cardinality.MandatoryOne;
    }

    private boolean isMandatoryToOptional(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                          GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality == Cardinality.MandatoryOne &&
                secondCardinality == Cardinality.OptionalOne;
    }

    private boolean isOneToOneAnyKind(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                                      GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){
        return  // (1,1) : (1:1)
                isMandatoryToMandatory(firstEdge, secondEdge) ||
                // (0,1) : (0,1)
                isOptionalToOptional(firstEdge, secondEdge)   ||
                // (1,1) : (0,1)
                isMandatoryToOptional(firstEdge, secondEdge)  ||
                // (0,1) : (1,1)
                isMandatoryToOptional(secondEdge, firstEdge);
    }

    /*
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

     */
}
