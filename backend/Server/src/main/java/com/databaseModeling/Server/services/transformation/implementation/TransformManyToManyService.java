package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.NodeTableManager;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphEdge;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformManyToManyService;

import java.util.stream.Collectors;

import static com.databaseModeling.Server.model.NodeTableManager.AddForeignKeysAsNormalColumn;
import static com.databaseModeling.Server.model.NodeTableManager.MergeTables;
import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TransformManyToManyService implements ITransformManyToManyService {


    @Override
    public void transformManyToManyRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {
        var relations = erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.StrongRelation ||
                        resolveErType(node) == ErType.IdentifyingRelation).
                collect(Collectors.toList());

        relations.forEach(this::transformManyToManyRelation);
    }

    private void transformManyToManyRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {

        if(! isManyToOne(relation)) return;

        var entities = ResolveEntitiesConnectedToRelation(relation);

        entities.forEach(entity ->
                NodeTableManager.AddForeignKeysAsPrimaryKeys(entity,relation));

        relation.getNodeData().getTreeData().setTransformed(true);
    }

    private boolean isManyToOne(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        if(relation.getDegree() > 2 ) return true;

        if(relation.getDegree() != 2) return false;

        var firstEdge = relation.getEdges().get(0);
        var secondEdge = relation.getEdges().get(1);

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality.isMultipleCardinality() && secondCardinality.isMultipleCardinality();
    }

}

