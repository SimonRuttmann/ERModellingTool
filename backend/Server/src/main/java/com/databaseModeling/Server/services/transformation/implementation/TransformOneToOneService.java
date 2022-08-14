package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.Cardinality;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformOneToOneService;

import java.util.Objects;

import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;
import static com.databaseModeling.Server.services.util.ErUtil.resolveStrongRelationsOfDeg2;

public class TransformOneToOneService implements ITransformOneToOneService {


    public TransformOneToOneService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;



    @Override
    public void transformOneToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveStrongRelationsOfDeg2(erGraph);
        relations.forEach(this::transformOneToOneRelation);

    }

    /**
     *
     * For one-to-one relationships, the "owning side" corresponds to the side
     * that contains the corresponding foreign key.
     * @param relation The relation to transform
     */
    private void transformOneToOneRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {

        var firstEdge = relation.getEdges().get(0);
        var secondEdge = relation.getEdges().get(1);

        var nodeOfFirstEge = firstEdge.getOtherSide(relation);
        var nodeOfSecondEdge = secondEdge.getOtherSide(relation);

        var isReflexive = Objects.equals(nodeOfFirstEge.getId(), nodeOfSecondEdge.getId());

        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> owningNode = null;
        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> nodeToReference = null;

        if(!isOneToOneAnyKind(firstEdge, secondEdge)) return;

        // Reflexive owning side resolution

        if(isReflexive){
            var relationData = resolveErData(relation);

            tableManager.addForeignKeysAsPrimaryKeys(nodeOfFirstEge,relation);
            tableManager.addForeignKeysAsPrimaryKeys(nodeOfFirstEge,relation);

            relationData.setTransformed(true);
            return;

        }

        // (0,1) : (0,1) and (1,1) : (1,1) owning side resolution

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

        // (1,1) : (0,1) and (0,1) : (1,1) owning side resolution

        //Owning side is the mandatory side
        if(isMandatoryToOptional(firstEdge, secondEdge)){
            owningNode = nodeOfFirstEge;
            nodeToReference = nodeOfSecondEdge;
        }

        if(isMandatoryToOptional(secondEdge, firstEdge)){
            owningNode = nodeOfSecondEdge;
            nodeToReference = nodeOfFirstEge;
        }

        //Transformation of the relation

        //Merge relation into owning node
        tableManager.mergeTables(owningNode, relation);
        //Add foreign keys to the owning node
        tableManager.addForeignKeysAsNormalColumn(nodeToReference, owningNode);

        var relationData = resolveErData(relation);
        relationData.setTransformed(true);
        tableManager.removeTable(relationData);
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

}
