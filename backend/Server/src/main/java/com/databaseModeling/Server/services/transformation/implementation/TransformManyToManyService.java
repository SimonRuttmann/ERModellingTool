package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.model.relationalModel.TableManager;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformManyToManyService;

import static com.databaseModeling.Server.services.util.ErUtil.resolveEntitiesConnectedToRelation;
import static com.databaseModeling.Server.services.util.ErUtil.resolveStrongRelations;

public class TransformManyToManyService implements ITransformManyToManyService {


    public TransformManyToManyService (TableManager tablemanager){
        this.tableManager = tablemanager;
    }

    private final TableManager tableManager;


    @Override
    public void transformManyToManyRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveStrongRelations(erGraph); //TODO was resolveRelations
        relations.forEach(this::transformManyToManyRelation);
    }

    private void transformManyToManyRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {

        if(! isManyToMany(relation)) return;

        var entities = resolveEntitiesConnectedToRelation(relation);

        entities.forEach(entity ->
                tableManager.addForeignKeysAsPrimaryKeys(entity,relation));

        relation.getNodeData().getTreeData().setTransformed(true);
    }

    private boolean isManyToMany(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation){

        if(relation.getDegree() > 2 ) return true;

        if(relation.getDegree() != 2) return false;

        var firstEdge = relation.getEdges().get(0);
        var secondEdge = relation.getEdges().get(1);

        var firstCardinality = firstEdge.getEdgeData().getCardinality();
        var secondCardinality = secondEdge.getEdgeData().getCardinality();

        return firstCardinality.isMultipleCardinality() && secondCardinality.isMultipleCardinality();
    }

}

