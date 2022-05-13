package com.databaseModeling.Server.services.transformation.implementation;

import com.databaseModeling.Server.model.NodeTableManager;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationAssociation;
import com.databaseModeling.Server.model.conceptionalModel.EntityRelationElement;
import com.databaseModeling.Server.model.conceptionalModel.ErType;
import com.databaseModeling.Server.model.dataStructure.graph.Graph;
import com.databaseModeling.Server.model.dataStructure.graph.GraphNode;
import com.databaseModeling.Server.model.dataStructure.tree.TreeNode;
import com.databaseModeling.Server.services.transformation.interfaces.ITransformIsAStructureService;

import java.util.stream.Collectors;

import static com.databaseModeling.Server.services.util.ErUtil.*;

public class TransformIsAStructureServiceService implements ITransformIsAStructureService {

    @Override
    public void transformIsAStructures(Graph<TreeNode<EntityRelationElement>, EntityRelationAssociation> erGraph) {

        var isaStructures = erGraph.graphNodes.
                stream().
                filter(node -> resolveErType(node) == ErType.IsAStructure).
                collect(Collectors.toList());

        isaStructures.forEach(this::transformIsAStructure);
    }

    private void transformIsAStructure(GraphNode<TreeNode<EntityRelationElement>, EntityRelationAssociation> isAStructure) {

        var base = ResolveBaseOfIsAStructure(isAStructure);
        var inheritors = ResolveInheritorsOfIsAStructure(isAStructure);

        inheritors.forEach(entity ->
                NodeTableManager.AddForeignKeysAsPrimaryKeys(entity, base));

        isAStructure.getNodeData().getTreeData().setTransformed(true);

    }
}
