package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformManyToOneService;

import java.util.Objects;

import static com.databaseModeling.Server.services.util.ErUtil.resolveErData;
import static com.databaseModeling.Server.services.util.ErUtil.resolveStrongRelationsOfDeg2;

public class TransformManyToOneService implements ITransformManyToOneService {


    public TransformManyToOneService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;


    @Override
    public void transformManyToOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveStrongRelationsOfDeg2(erGraph);
        relations.forEach(this::transformOneToManyRelation);
    }

    /**
     * Transforms One-To-Many relations by merging the table of the relation to the table of the many side
     * Also creates foreign keys to the table of the one side
     *
     * @param relation The relation to transform
     *
     * Remark:
     * In Min-Max Notation the cardinalities are switched
     * A - 1,N -AB - 1 - B => One A has multiple Bs and one B has one A
     */
    private void transformOneToManyRelation(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        var edges = relation.getEdges();

        var firstEdge = edges.get(0);
        var secondEdge = edges.get(1);

        var nodeOfFirstEge = firstEdge.getOtherSide(relation);
        var nodeOfSecondEdge = secondEdge.getOtherSide(relation);

        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> singleNode;
        GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> manyNode;

        if (isManyToOne(firstEdge, secondEdge)) {
            singleNode = nodeOfFirstEge;
            manyNode = nodeOfSecondEdge;
        }
        else if(isManyToOne(secondEdge, firstEdge)){
            singleNode = nodeOfSecondEdge;
            manyNode = nodeOfFirstEge;
        }
        else return;

        var isReflexive = Objects.equals(nodeOfFirstEge.getId(), nodeOfSecondEdge.getId());
        if(isReflexive){

            var relationData = resolveErData(relation);

            tableManager.addForeignKeysAsPrimaryKeys(nodeOfFirstEge,relation);
            tableManager.addForeignKeysAsPrimaryKeys(nodeOfFirstEge,relation);

            relationData.setTransformed(true);
            return;
        }

        tableManager.mergeTables(manyNode, relation);
        tableManager.addForeignKeysAsNormalColumn(singleNode, manyNode);

        var relationData = resolveErData(relation);
        relationData.setTransformed(true);
    }


    private boolean isManyToOne(GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> firstEdge,
                             GraphEdge<TreeNode<EntityRelationElement>, EntityRelationAssociation> secondEdge){

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality.isMultipleCardinality() && secondCardinality.isSingleOrLess();
    }


}
