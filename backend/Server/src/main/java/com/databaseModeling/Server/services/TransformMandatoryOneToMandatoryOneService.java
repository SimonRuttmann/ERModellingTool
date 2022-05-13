package com.databaseModeling.Server.services;

import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;

import static com.databaseModeling.Server.services.util.ErUtil.resolveRelationsOfDeg2;

public class TransformMandatoryOneToMandatoryOneService implements ITransformMandatoryOneToMandatoryOneService {

    @Override
    public void transformMandatoryOneToMandatoryOneRelations(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var relations = resolveRelationsOfDeg2(erGraph);
        relations.forEach(this::transformMandatoryOneToMandatoryOneRelation);

    }

    private void transformMandatoryOneToMandatoryOneRelation(
            GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> relation) {
        //TODO
    }
}
