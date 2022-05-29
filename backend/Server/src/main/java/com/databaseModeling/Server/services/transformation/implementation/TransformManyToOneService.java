package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.NodeTableManager;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformManyToOneService;

import java.util.Objects;

import static com.databaseModeling.Server.model.NodeTableManager.AddForeignKeysAsNormalColumn;
import static com.databaseModeling.Server.model.NodeTableManager.MergeTables;
import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;
import static com.databaseModeling.Server.services.util.ErUtil.resolveStrongRelationsOfDeg2;

public class TransformManyToOneService implements ITransformManyToOneService {

//Achtung min,max ist umgekehrt
    // A - 1,N -AB - 1 - B
    // 1 A hat n viele b
    // 1 B hat 1 A
    //Stimmt hier
    @Override
    public void transformManyToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveStrongRelationsOfDeg2(erGraph);
        relations.forEach(this::transformOneToManyRelation);
    }


    private void transformOneToManyRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        var edges = relation.getEdges();

        var firstEdge = edges.get(0);
        var secondEdge = edges.get(1);

        var nodeOfFirstEge = firstEdge.getOtherSide(relation);
        var nodeOfSecondEdge = secondEdge.getOtherSide(relation);

        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> singleNode;
        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> manyNode;

        if (isManyToOne(firstEdge, secondEdge)) {
            singleNode = nodeOfSecondEdge;
            manyNode = nodeOfFirstEge;
        }
        else if(isManyToOne(secondEdge, firstEdge)){
            singleNode = nodeOfFirstEge;
            manyNode = nodeOfSecondEdge;
        }
        else return;

        var isReflexive = Objects.equals(nodeOfFirstEge.getId(), nodeOfSecondEdge.getId());
        if(isReflexive){

            var relationData = resolveErData(relation);

            NodeTableManager.AddForeignKeysAsPrimaryKeys(nodeOfFirstEge,relation);
            NodeTableManager.AddForeignKeysAsPrimaryKeys(nodeOfFirstEge,relation);

            relationData.setTransformed(true);
            return;
        }


        MergeTables(manyNode, relation);
        AddForeignKeysAsNormalColumn(singleNode, manyNode);

        var relationData = resolveErData(relation);
        relationData.setTransformed(true);
        relationData.removeTable();
    }




    private boolean isManyToOne(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                             GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality.isMultipleCardinality() && secondCardinality.isSingleOrLess();
    }


}
