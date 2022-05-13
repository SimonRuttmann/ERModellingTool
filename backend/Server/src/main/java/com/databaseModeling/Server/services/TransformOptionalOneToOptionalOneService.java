package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import static com.databaseModeling.Server.services.util.ErUtil.resolveRelationsOfDeg2;

public class TransformOptionalOneToOptionalOneService implements ITransformOptionalOneToOptionalOneService{

    @Override
    public void transformOptionalOneToOptionalOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveRelationsOfDeg2(erGraph);
        relations.forEach(this::transformOptionalOneToOptionalOneRelation);

    }

    private void transformOptionalOneToOptionalOneRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {
        //TODO
    }
}
